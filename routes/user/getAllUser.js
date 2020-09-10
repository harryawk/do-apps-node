const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const Util = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];

const getAllUser = async (req, res) => {

  let orderBy = '_id';
  let orderDirection = 'asc';
  let pageSize = 1;
  let page = 0;
  let search = '';

  if ('orderBy' in req.query) {
    orderBy = req.query.orderBy;
  }

  if ('orderDirection' in req.query) {
    orderDirection = req.query.orderDirection;
  }

  if ('pageSize' in req.query) {
    pageSize = parseInt(req.query.pageSize);
  }

  if ('page' in req.query) {
    page = parseInt(req.query.page) - 1;
    if (page < 0) page = 0;
  }

  if ('search' in req.query) {
    search = req.query.search;
  }

  let sortArg = {}; sortArg[orderBy] = orderDirection;
  let findArg = {}; 

  if (search !== '') {
    findArg['name'] = { $regex: search, $options: 'i' };
  }

  let query = req.query.params;

  let result = [];
  let recordsTotal = 0;
  
  try {
    result = await User.find(findArg).select(query).sort(sortArg).skip(page * pageSize).limit(pageSize);
    for (let populationSetting of populationSettings) {
      result = await User.populate(result, populationSetting);
    }
    recordsTotal = await User.countDocuments(findArg).exec();

  } catch (err) {
    console.log(err);
    sendResponse(res, false, String(err));
    return;
  }

  sendResponse(res, true, result, recordsTotal);
};

module.exports = {
  getAllUser,
};