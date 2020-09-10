const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const Util = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];

const getPaginatedUser = async (req, res) => {

  let page = req.params.page - 1;
  let perPage = Config.perPage;

  let query = req.query.params;
  let result = await User.find().select(query).skip(page * perPage).limit(perPage);
  for (let populationSetting of populationSettings) {
    result = await User.populate(result, populationSetting);
  }
  // let result = await User.find().select(query);

  sendResponse(res, true, result);
};

module.exports = {
  getPaginatedUser,
};