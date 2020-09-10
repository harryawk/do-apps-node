const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const { validateRequest } = require('../../helpers/utils');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];

const loginUser = async (req, res) => {

  let reqBody = req.body;
  let result = {};

  let errorMessages = validateRequest(['username', 'password'], reqBody);
  if (errorMessages.length > 0) {
    let error = '';
    for (let message of errorMessages) {
      error = error + '\n' + message;
    }

    sendResponse(res, false, error);
    return;
  }

  let user = await User.findOne({
    username: reqBody['username']
  }).select('+password');

  if (user === null || typeof user === 'undefined') {
    sendResponse(res, false, 'Kredensial Salah');
    return;
  } else if (Object.keys(user).length === 0) {
    sendResponse(res, false, 'Kredensial Salah');
    return;
  } else if (!bcrypt.compareSync(password, user['password'])) {
    sendResponse(res, false, 'Kredensial Salah');
    return;
  }

  // otherwise, credentials valid.

  for (let populationSetting of populationSettings) {
    user = await User.populate(user, populationSetting);
  }

  // For Debugging Purpose
  // console.log('---- user -----')
  // console.log(user)
  // console.log(typeof user)
  // console.log('---- user -----')

  if (user === null) {
    sendResponse(res, false, 'Username and/or Password is not correct');
    return;
  } // otherwise

  let token = jwt.sign({username: reqBody['username'], password: reqBody['password']}, secret);

  if ('password' in user) {
    delete user['password'];
  }
  
  result['user'] = user;
  result['token'] = token;

  sendResponse(res, true, result);
};

module.exports = {
  loginUser,
};