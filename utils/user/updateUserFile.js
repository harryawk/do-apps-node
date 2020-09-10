let { generalUpdateFile } = require('../../helpers/utils');

const updateUserFile = async (request, requestBody) => {
  let result = requestBody;
  result = generalUpdateFile(request, requestBody, 'avatar', 'user', '');
  // new_assignment_file_2
  return result;
};

module.exports = {
  updateUserFile,
};