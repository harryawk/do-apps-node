const fs = require('fs');
const Config = require('../config');
const DO = require('aws-sdk');
const spacesEndpoint = new DO.Endpoint('sgp1.digitaloceanspaces.com');
const doSpace = new DO.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_ACCESS_KEY_SECRET,
});
let cloundinary = require('cloudinary');
cloundinary.config(process.env.CLOUDINARY_URL);

// UTILITY#2 : FILE REMOVER
// File Uploader to Cloud and Local

const fileExist = (path) => {
  return fs.existsSync(path);
};

const removeFile = (path) => {
  if (fileExist(path)) {
    fs.unlinkSync(path);
  }
};

const isJsonString = (jsonString) => {
  try {
    JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
  return true;
};


const removeFileByURL = async (body, fieldname, fileUrls, hasCurrent = false) => {
  if (isJsonString(fileUrls)) {
    fileUrls = JSON.parse(fileUrls);
    let pulledStrings = [];
    for (let fileUrl of fileUrls) {
      pulledStrings.push(fileUrl);
      (process.env.NODE_LOCAL === 'local')
        ? await removeFileFromLocal(fileUrl)
        : await removeFileFromCloud(fileUrl);
    }
    if (hasCurrent) {
      return body;
    }
    
    if (pulledStrings.length > 0) {
      if ('$pull' in body) {
        body['$pull'][fieldname] = {};
        body['$pull'][fieldname]['$in'] = pulledStrings;
      } else {
        body['$pull'] = {};
        body['$pull'][fieldname] = {};
        body['$pull'][fieldname]['$in'] = pulledStrings;
      }
    }
  } else {
    let deletionResult = (process.env.NODE_LOCAL === 'local')
      ? await removeFileFromLocal(fileUrls)
      : await removeFileFromCloud(fileUrls);
    
    // console.log(deletionResult);
    if (fileUrls !== '') {
      body[fieldname] = '';
    }
  }

  return body;
  
}

const removeFileFromCloud = async (fileUrl) => {

  let bucketParams = {
    Bucket: Config.bucketName
  };

  let bucketKey = [];
  if (fileUrl && fileUrl !== null) {
    bucketKey = fileUrl.split('digitaloceanspaces.com/')[1];
  } else {
    return;
  }

  console.log(bucketKey);
  bucketParams['Key'] = bucketKey;
  try {
    let response = await doSpace.deleteObject(bucketParams).promise();
    console.log(response);
  } catch(err) {
    console.log('error');
    console.log(err);
    console.log('error');
  }
};

const removeFileFromLocal = async (fileUrl) => {
  let bucketKey = [];
  if (fileUrl && fileUrl !== null) {
    bucketKey = fileUrl.split('/');
  }

  if (bucketKey.length === 0) {
    return;
  }

  let fileName = `./public/${bucketKey[bucketKey.length - 2]}/${bucketKey[bucketKey.length - 1]}`;

  removeFile(fileName);
};

const removeFileFromDB = async (requestBody, filePropertyName, defaultEmpty) => {

  if ('updatedAttribute' in requestBody) {

    if (requestBody['updatedAttribute'] === filePropertyName) {
      // fall through
    } else {
      return requestBody;  
    }

  } else {
    delete requestBody['deleted_urls'];
    delete requestBody['current_urls'];
    return requestBody;
  }


  if (typeof defaultEmpty === 'string') {
    if ('deleted_urls' in requestBody) {
      let requestedUrl = requestBody['deleted_urls'];
      (process.env.NODE_LOCAL === 'local')
        ? await removeFileFromLocal(requestedUrl)
        : await removeFileFromCloud(requestedUrl);
        
      delete requestBody['deleted_urls'];
      let resultRequestBody = requestBody;
      resultRequestBody[filePropertyName] = '';
      return resultRequestBody;
    }

    let requestedUrl = requestBody[filePropertyName];
    (process.env.NODE_LOCAL === 'local')
      ? await removeFileFromLocal(requestedUrl)
      : await removeFileFromCloud(requestedUrl);
    
    return;
  }
  
  if (!('deleted_urls' in requestBody)) {
    for (let deletedUrl of requestBody[filePropertyName]) {
      (process.env.NODE_LOCAL === 'local')
        ? await removeFileFromLocal(deletedUrl)
        : await removeFileFromCloud(deletedUrl);
    }
    return;
  }
  
  if (!isJsonString(requestBody['deleted_urls']) || !isJsonString(requestBody['current_urls'])) {
    delete requestBody['deleted_urls'];
    delete requestBody['current_urls'];
    return requestBody;
  }

  let deleted_urls = JSON.parse(requestBody['deleted_urls']);
  let current_urls = JSON.parse(requestBody['current_urls']);

  if (deleted_urls.length > 0) {
    for (let deletedUrl of deleted_urls) {
      if (current_urls.indexOf(deletedUrl) > -1) {
        current_urls.splice(current_urls.indexOf(deletedUrl), 1);
      }
      (process.env.NODE_LOCAL === 'local')
        ? await removeFileFromLocal(deletedUrl)
        : await removeFileFromCloud(deletedUrl);
    }
  
    delete requestBody['deleted_urls'];
    delete requestBody['current_urls'];
    let resultRequestBody = requestBody;
    resultRequestBody[filePropertyName] = current_urls;
    return resultRequestBody;
  }
  
  delete requestBody['deleted_urls'];
  delete requestBody['current_urls'];
  let resultRequestBody = requestBody;
  resultRequestBody[filePropertyName] = current_urls;
  return resultRequestBody;
};

module.exports = {
  removeFileFromCloud,
  removeFileFromLocal,
  removeFileFromDB,
};