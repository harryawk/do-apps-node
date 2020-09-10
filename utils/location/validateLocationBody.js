let { validateRequest } = require('../../helpers/utils');

let requiredProps = [
  // new_prop_below

  'name',
];

const validateLocationBody = (reqBody) => {
  return validateRequest(requiredProps, reqBody);
};

module.exports = {
  validateLocationBody,
};