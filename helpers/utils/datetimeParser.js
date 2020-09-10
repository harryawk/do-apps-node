const moment = require('moment');
const _ = require('lodash');

// UTILITY#4 : DATE AND TIME PARSER
// Date and Time parser and restucture method

const dateKeys = { years: null, months: null, date: null };
const timeKeys = { hours: null, minutes: null };

const dateToObject = (dateString, dateFormat) => {
  try {
    return (typeof moment(dateString, dateFormat).toObject() === 'object') 
      ? _.pick(moment(dateString, dateFormat).toObject(), _.keys(dateKeys))
      : dateKeys;
  } catch(err) {
    console.log('error');
    console.log(err);

    return err;
  }
};

const timeToObject = (timeString, timeFormat) => {
  try {
    return (typeof moment(timeString, timeFormat).toObject() === 'object') 
      ? _.pick(moment(timeString, timeFormat).toObject(), _.keys(timeKeys))
      : timeKeys;
  } catch(err) {
    console.log('error');
    console.log(err);

    return err;
  }
};

const insertDatetimeInBody = (reqBody) => {

  if (!_.has(reqBody, ['dateFormat'])) {
    reqBody = _.omit(reqBody, ['eventDate', 'deadline', 'birthDate', 'dateFormat']);
  } else {
    if (_.has(reqBody, ['eventDate'])) {
      reqBody['eventDate'] = (typeof dateToObject(reqBody['eventDate'], reqBody['dateFormat']) === 'object')
        ? dateToObject(reqBody['eventDate'], reqBody['dateFormat'])
        : dateKeys;
    } else if (_.has(reqBody, ['birthDate'])) {
      reqBody['birthDate'] = (typeof dateToObject(reqBody['birthDate'], reqBody['dateFormat']) === 'object')
        ? dateToObject(reqBody['birthDate'], reqBody['dateFormat'])
        : dateKeys;
    } else if (_.has(reqBody, ['deadline'])) {
      reqBody['deadline'] = (typeof dateToObject(reqBody['deadline'], reqBody['dateFormat']) === 'object')
        ? dateToObject(reqBody['deadline'], reqBody['dateFormat'])
        : dateKeys;
    } else {
      reqBody = _.omit(reqBody, ['dateFormat']);
    }
  }

  if (!_.has(reqBody, ['timeFormat'])) {
    reqBody = _.omit(reqBody, ['eventTime', 'timeFormat']);
  } else {
    if (_.has(reqBody, ['eventTime'])) {
      reqBody['eventTime'] = (typeof timeToObject(reqBody['eventTime'], reqBody['timeFormat']) === 'object')
        ? timeToObject(reqBody['eventTime'], reqBody['timeFormat'])
        : timeKeys;
    } else {
      reqBody = _.omit(reqBody, ['timeFormat']);
    }
  }
    
  return reqBody;
};

module.exports = {
  dateToObject,
  timeToObject,
  insertDatetimeInBody,
};