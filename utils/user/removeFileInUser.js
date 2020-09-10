let { removeFileFromDB } = require('../../helpers/utils');

const removeFileInUser = async (requestBody) => {
  let result = requestBody;
  result = removeFileFromDB(requestBody, 'avatar', '');
  // new_assignment_file_1
  return result;
};

module.exports = {
  removeFileInUser,
};