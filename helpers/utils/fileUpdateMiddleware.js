const { removeFileByURL } = require('./removeFile');
const { generateFileURL } = require('./uploadFile');

const fileUpdateMiddleware = async (files, reqBody, fileDict, fileMapping, defaultEmpty, keyPath, fieldname) => {

  if (typeof files === 'undefined') {
    if (fieldname in fileDict) {
      if ('deleted' in fileDict[fieldname]) {
        // Remove File in URLs inside fileDict[fieldname]['deleted']
        if ('current' in fileDict[fieldname]) {
          reqBody = await removeFileByURL(reqBody, fieldname, fileDict[fieldname]['deleted'], true);
        } else {
          reqBody = await removeFileByURL(reqBody, fieldname, fileDict[fieldname]['deleted']);
        }
      }
    }
    return reqBody;
  }

  if (files.length > 0) {

    if (fieldname in fileDict) {
      if ('deleted' in fileDict[fieldname]) {
        // Remove File in URLs inside fileDict[fieldname]['deleted']
        if ('current' in fileDict[fieldname]) {
          reqBody = await removeFileByURL(reqBody, fieldname, fileDict[fieldname]['deleted'], true);
        } else {
          return reqBody;
        }
      }
      
      if ('current' in fileDict[fieldname]) {
        // Concat file URLs with fileDict[fieldname]['current']
        /**
         * $set: {
         *    `${fieldname}`: generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname], fileDict[fieldname]['current'])
         * }
         * 
         * or
         * 
         * reqBody[fieldname] = generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname], fileDict[fieldname]['current']);
         */
        reqBody = await generateFileURL(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname], fileDict);
      } else {
        // Push array of file URLs to fieldname
        /**
         * $push: {
         *    `${fieldname}`: generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]) (Array[])
         * }
         * 
         * or
         * 
         * reqBody['$push'] = {
         *    `${fieldname}`: generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]) (Array[])
         * }
         */
        if ('deleted' in fileDict[fieldname]) {
          return reqBody;
        } else {
          reqBody = await generateFileURL(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]);
        }
      }
      
    } else {
      // fieldname not in fileDict
      // Push array of file URLs to fieldname
      /**
       * $push: {
       *    `${fieldname}`: generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]) (Array[])
       * }
       * 
       * or
       * 
       * reqBody['$push'] = {
       *    `${fieldname}`: generatedFilenames(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]) (Array[])
       * }
       */
      reqBody = await generateFileURL(reqBody, defaultEmpty, keyPath, fieldname, fileMapping[fieldname]);
    }
    
  } else {
    // files.length === 0

    if (fieldname in fileDict) {
      if ('deleted' in fileDict[fieldname]) {
        // Remove File in URLs inside fileDict[fieldname]['deleted']
        reqBody = await removeFileByURL(reqBody, fieldname, fileDict[fieldname]['deleted']);
        // if ('current' in fileDict[fieldname]) {
        // } else {
        //   reqBody = await removeFileByURL(reqBody, fieldname, fileDict[fieldname]['deleted']);
        // }
      }
    }

  }

  return reqBody;
}

module.exports = {
  fileUpdateMiddleware,
}