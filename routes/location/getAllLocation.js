const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const getAllLocation = async (req, res) => {

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

  let result = [];
  let recordsTotal = 0;

  try {
    let query = req.query.params;
    result = await Location.find(findArg).select(query).sort(sortArg).skip(page * pageSize).limit(pageSize);
    recordsTotal = await Location.countDocuments(findArg).exec();
  } catch (err) {
    console.log(err);
    sendResponse(res, false, String(err));
    return;
  }

  // populate_below_1

  sendResponse(res, true, result, recordsTotal);
};

module.exports = {
  getAllLocation,
};