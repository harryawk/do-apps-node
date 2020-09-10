let { generateUser } = require('./generateUser');
let { removeFileInUser } = require('./removeFileInUser');
let { updateUserFile } = require('./updateUserFile');
let { validateUserBody } = require('./validateUserBody');

module.exports = {
  generateUser,
  removeFileInUser,
  updateUserFile,
  validateUserBody,
};