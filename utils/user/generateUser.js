let { uploadFileToDO, uploadFileToLocal } = require('../../helpers/utils');

const generateUser = async (requestObject, generatedUserID) => {
  let reqBody = requestObject.body;

  let avatarData = (process.env.NODE_LOCAL !== 'local')
    ? await uploadFileToDO(requestObject, '', `userpic/${generatedUserID}`, 'avatar')
    : await uploadFileToLocal(requestObject, '', `userpic/${generatedUserID}`, 'avatar');

  return {
    _id: generatedUserID,
    name: reqBody['name'],
    email: reqBody['email'],
    username: reqBody['username'],
    address: reqBody['address'],
    password: reqBody['password'],
    avatar: avatarData,
  };
};

module.exports = {
  generateUser,
};