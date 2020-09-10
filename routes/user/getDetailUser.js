const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const Util = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];

const getDetailUser = async (req, res) => {

  let UserID = req.params.user_id;

  let result = {};
  try {
    result = await User.findById(UserID);

    if (result === null) {
      sendResponse(res, false, 'No User data');
      return;
    }
    
    for (let populationSetting of populationSettings) {
      result = await User.populate(result, populationSetting);
    }

  } catch(err) {
    console.log(err);
    sendResponse(res, false, err);
    return;
  }

  sendResponse(res, true, result);
};

module.exports = {
  getDetailUser,
};