let { uploadFileToDO, uploadFileToLocal } = require('../../helpers/utils');

const generateLocationObject = async (requestObject, generatedLocationID) => {
  let reqBody = requestObject.body;

  return {
    _id: generatedLocationID,
    name: reqBody['name'],
    // new_attribute_above_2
  };
};

module.exports = {
  generateLocationObject,
};