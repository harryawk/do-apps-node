let { validateRequest } = require('../../helpers/utils');

let requiredProps = [
  // new_prop_below

  'name',
  'email',
  'username',
  'address',
  'password',
];

const validateUserBody = (reqBody) => {
  return validateRequest(requiredProps, reqBody);
};

module.exports = {
  validateUserBody,
};