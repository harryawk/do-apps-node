const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const getAllLocationNoFilter = async (req, res) => {

  let result = [];
  let recordsTotal = 0;

  try {

    let query = req.query.params;

    result = await Location.find().select(query);
    recordsTotal = await Location.countDocuments(findArg).exec();
  } catch(err) {
    console.log(err);
    sendResponse(res, false, String(err));
    return;
  }

  // populate_below_2

  sendResponse(res, true, result, recordsTotal);
};

module.exports = {
  getAllLocationNoFilter,
};