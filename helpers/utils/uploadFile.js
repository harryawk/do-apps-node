const fs = require('fs');
const Config = require('../config');
const DO = require('aws-sdk');
const spacesEndpoint = new DO.Endpoint('sgp1.digitaloceanspaces.com');
const doSpace = new DO.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_ACCESS_KEY_SECRET,
});
let cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// UTILITY#1 : FILE UPLOADER
// File Uploader to Cloud and Local

const fileExist = (path) => {
  return fs.existsSync(path);
};

const removeFile = (path) => {
  if (fileExist(path)) {
    fs.unlinkSync(path);
  }
};

const getFileExt = (filename) => {
  return filename.split('.')[(filename.split('.')).length - 1];
};

const isJsonString = (jsonString) => {
  try {
    JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
  return true;
};

const uploadFileToLocal = async (requestObject, defaultEmpty, keyPath, fieldname) => {

  try {

    let filesMapping = {};
    for (let file of requestObject.files) {

      file.fieldname = file.fieldname.split('[]')[0];
      
      if (file.fieldname in filesMapping) {
        // fall through
      } else {
        filesMapping[file.fieldname] = [];
      }
  
      (filesMapping[file.fieldname]).push(file);
    }

    // console.log('filesMapping');
    // console.log(filesMapping);
    // console.log('filesMapping');

    if (typeof defaultEmpty === 'string') {
      if (filesMapping[fieldname].length > 0) {
        return `http://${requestObject.headers.host}/uploads/${filesMapping[fieldname][0]['filename']}`
      } else {
        return defaultEmpty;
      }
    } else if (typeof defaultEmpty === 'object') {

      if (filesMapping[fieldname].length > 0) {
        let resultArray = [];
        for (let i = 0; i < filesMapping[fieldname].length; i++) {
          resultArray.push(`http://${requestObject.headers.host}/uploads/${filesMapping[fieldname][i]['filename']}`);
        }
        return resultArray;
      } else {
        return defaultEmpty;
      }
    } else {
      return defaultEmpty;
    }

  } catch (err) {
    console.log('error');
    console.log(err);
    console.log('error');

    return defaultEmpty;
  }
  
};

const uploadFileToDO = async (requestObject, defaultEmpty, keyPath, fieldname) => {
  
  /**
   * Logic:
   * 
   * 1. Differentiate files owned by each fields from form-data
   * 2. If defaultEmpty is string, upload first element of the fieldname file metadata and return the resulted URL
   * 3. If defaultEmpty is object, initialize resultArray and for each element of fieldname file metadata:
   *      1. upload using uploader sdk to cloud
   *      2. save the resulted URL to resultArray
   *      3. return resultArray
   * 4. Remove file.path
   * 5. Otherwise or Catch Exception, return defaultEmpty.
   * 6. Done
   */

  let uploadParams = {
    ACL: 'public-read',
    Bucket: Config.bucketName
  };

  try {

    let filesMapping = {};
    for (let file of requestObject.files) {
      
      file.fieldname = file.fieldname.split('[]')[0];

      if (file.fieldname in filesMapping) {
        // fall through
      } else {
        filesMapping[file.fieldname] = [];
      }

      (filesMapping[file.fieldname]).push(file);
    }

    // console.log('filesMapping');
    // console.log(filesMapping);
    // console.log('filesMapping');

    if (Object.keys(filesMapping).length === 0) {
      return defaultEmpty;
    }

    if (typeof defaultEmpty === 'string') {
      if (filesMapping[fieldname].length > 0) {
        uploadParams['Body'] = fs.createReadStream(filesMapping[fieldname][0]['path']);
        uploadParams['Key'] = `${keyPath}/${fieldname}-${Date.now()}.${getFileExt(filesMapping[fieldname][0]['path'])}`;
        let result = await doSpace.upload(uploadParams).promise();
        
        if (result) {
          removeFile(filesMapping[fieldname][0]['path']);
          return result.Location;
        }

        return defaultEmpty;
      } else {
        return defaultEmpty;
      }
    } else if (typeof defaultEmpty === 'object') {

      if (filesMapping[fieldname].length > 0) {
        let resultArray = [];
        for (let i = 0; i < filesMapping[fieldname].length; i++) {

          uploadParams['Body'] = fs.createReadStream(filesMapping[fieldname][i]['path']);
          uploadParams['Key'] = `${keyPath}/${fieldname}-${Date.now()}.${getFileExt(filesMapping[fieldname][i]['path'])}`;
          let result = await doSpace.upload(uploadParams).promise();
          resultArray.push(result.Location);
          if (result) {
            removeFile(filesMapping[fieldname][i]['path']);
          }

        }
        return resultArray;
      } else {
        return defaultEmpty;
      }
    } else {
      return defaultEmpty;
    }

  } catch (err) {
    console.log('error');
    console.log(err);
    console.log('error');
    
    return defaultEmpty;
  }
};

const generalUpdateFile = async (request, requestBody, picturePropertyName, modelName, defaultEmpty) => {
  if (!request.files) {
    return requestBody;
  }

  if ('updatedAttribute' in requestBody) {

    if (requestBody['updatedAttribute'] === picturePropertyName) {
      // fall through
    } else {
      return requestBody;  
    }

  } else {
    return requestBody;
  }
  
  if (request.files.length > 0) {
    let pictureData = (process.env.NODE_LOCAL !== 'local')
      ? await uploadFileToDO(request, defaultEmpty, `${modelName}pic/${request.params[`${modelName}_id`]}`, picturePropertyName)
      : await uploadFileToLocal(request, defaultEmpty, `${modelName}pic/${request.params[`${modelName}_id`]}`, picturePropertyName);
    
    if (typeof defaultEmpty === 'string') {
      requestBody[picturePropertyName] = pictureData;
    } else if (typeof defaultEmpty === 'object') {
      (picturePropertyName in requestBody)
        ? requestBody[picturePropertyName] = (requestBody[picturePropertyName]).concat(pictureData)
        : requestBody[picturePropertyName] = pictureData;
    }
  
    return requestBody;
  }
  
  return requestBody;
};


const generateURLFromLocal = async (defaultEmpty, keyPath, fieldname, fileMapping) => {
  
  try {

    if (typeof defaultEmpty === 'string') {
      if (fileMapping.length > 0) {
        return `http://localhost:9999/uploads/${fileMapping[0]['filename']}`
      } else {
        return defaultEmpty;
      }
    } else if (typeof defaultEmpty === 'object') {
      if (fileMapping.length > 0) {
        let resultArray = [];
        for (let i = 0; i < fileMapping.length; i++) {
          resultArray.push(`http://localhost:9999/uploads/${fileMapping[i]['filename']}`);
        }
        return resultArray;
      } else {
        return defaultEmpty;
      }
    } else {
      return defaultEmpty;
    }
  
  } catch (err) {
    console.log('generateURLFromLocal');
    console.log(err);
    return defaultEmpty;
  }
};

const generateURLFromDO = async (defaultEmpty, keyPath, fieldname, fileMapping) => {

  
  let uploadParams = {
    ACL: 'public-read',
    Bucket: Config.bucketName,
  };

  try {

    if (typeof defaultEmpty === 'string') {
      if (fileMapping.length > 0) {
        uploadParams['Body'] = fs.createReadStream(fileMapping[0]['path']);
        uploadParams['Key'] = `${keyPath}/${fieldname}-${Date.now()}.${getFileExt(fileMapping[0]['path'])}`;
        let result = await doSpace.upload(uploadParams).promise();
        
        if (result) {
          removeFile(fileMapping[0]['path']);
          return result.Location;
        }
        
      } else {
        return defaultEmpty;
      }
    } else if (typeof defaultEmpty === 'object') {
      console.log(defaultEmpty)
      console.log(fieldname)
      console.log(fileMapping)
      if (fileMapping.length > 0) {
        let resultArray = [];
        for (let i = 0; i < fileMapping.length; i++) {
          uploadParams['Body'] = fs.createReadStream(fileMapping[i]['path']);
          uploadParams['Key'] = `${keyPath}/${fieldname}-${Date.now()}.${getFileExt(fileMapping[i]['path'])}`;
          let result = await doSpace.upload(uploadParams).promise();
          
          if (result) {
            removeFile(fileMapping[i]['path']);
            resultArray.push(result.Location);
          }
        }
        return resultArray;

      } else {
        return defaultEmpty;
      }
    } else {
      return defaultEmpty;
    }

  } catch (err) {
    console.log('generateURLFromDO');
    console.log(err);
    return defaultEmpty;
  }
};

const generateFileURL = async (body, defaultEmpty, keyPath, fieldname, fileMapping, fileDict = null) => {
  /**
   * body => req.body
   * defaultEmpty => [] or ''
   * modelName => modelName
   * fieldname => req.files.$.fieldname
   * parent.fileDict => Dictionary of _current and _deleted in body request
   * [
   *  {
   *     current: "",
   *     deleted: "",
   *  }
   *  ...etc
   * ]
   * this.fileDict => fileDict[fieldname]['current']
   * this.fileDict === null ? push : concat
   * parent.fileMapping => mapping req.files.$.fieldname => req.files.$ (type: Array<Array<>>)
   * this.fileMapping => parent.fileMapping[fieldname] (type: Array<>)
   */
  
  let uploadedFiles = (process.env.NODE_LOCAL === 'local')
    ? await generateURLFromLocal(defaultEmpty, keyPath, fieldname, fileMapping)
    : await generateURLFromDO(defaultEmpty, keyPath, fieldname, fileMapping);
  
  if (fileDict === null) {
    if (typeof defaultEmpty === 'object') {
      if ('$push' in body) {
        body['$push'][fieldname] = uploadedFiles;
      } else {
        body['$push'] = {};
        body['$push'][fieldname] = uploadedFiles;
      }
    } else if (typeof defaultEmpty === 'string') {
      body[fieldname] = uploadedFiles;
    }
  } else {
    if (isJsonString(fileDict[fieldname]['current'])) {

      if (typeof defaultEmpty === 'object') {
        let resultedArray = (JSON.parse(fileDict[fieldname]['current'])).concat(uploadedFiles);
        body[fieldname] = resultedArray;
      } else if (typeof defaultEmpty === 'string') {
        body[fieldname] = uploadedFiles;
      } else {
        body[fieldname] = uploadedFiles;
      }
    } else {
      body[fieldname] = uploadedFiles;
    }
  }

  return body;
  
};

module.exports = {
  uploadFileToLocal,
  uploadFileToDO,
  generalUpdateFile,
  generateFileURL,
  isJsonString,
}