
let { generateLocation } = require('./generateLocation');
let { updateLocationFile } = require('./updateLocationFile');
let { removeFileInLocation } = require('./removeFileInLocation');
let { validateLocationBody } = require('./validateLocationBody');

module.exports = {
  generateLocation,
  updateLocationFile,
  removeFileInLocation,
  validateLocationBody,
};