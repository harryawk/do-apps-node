// register all utility files here

let { validateRequest } = require('./bodyValidator');
let { removeFileFromCloud, removeFileFromDB, removeFileFromLocal } = require('./removeFile');
let { generalUpdateFile, uploadFileToDO, uploadFileToLocal, generateFileURL, isJsonString } = require('./uploadFile');
let { dateToObject, insertDatetimeInBody, timeToObject } = require('./datetimeParser');
let { fileUpdateMiddleware } = require('./fileUpdateMiddleware');
let { generateFileDict } = require('./generateFileDict');
let { generateFileMapping } = require('./generateFileMapping');

module.exports = {
  fileUpdateMiddleware,
  generateFileDict,
  generateFileMapping,
  generateFileURL,
  isJsonString,
  
  validateRequest,
  removeFileFromCloud,
  removeFileFromDB,
  removeFileFromLocal,
  generalUpdateFile,
  uploadFileToDO,
  uploadFileToLocal,
  dateToObject,
  insertDatetimeInBody,
  timeToObject,
};