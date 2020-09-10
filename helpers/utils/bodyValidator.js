const Config = require('../config');

// UTILITY#3 : Request Body Validator
// Global Request Body Validator

const validateRequest = (dataProperties, reqBody) => {
  const language = Config.language;
  let errors = [];

  if (typeof reqBody === undefined) {
    return ['Request Body is undefined'];
  }

  for (let property of dataProperties) {
    (property in reqBody) ? reqBody[property] : errors.push(`Data ${language[property]} tidak ditemukan. Harap kirim data ${language[property]}`);
  }

  return errors;
};

module.exports = {
  validateRequest,
};