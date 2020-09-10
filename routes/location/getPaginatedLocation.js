const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const getPaginatedLocation = async (req, res) => {

  let page = req.params.page - 1;
  let perPage = Config.perPage;

  // let result = await Location.findById(LocationID);
  let query = req.query.params;
  let result = await Location.find().select(query).skip(page * perPage).limit(perPage);
  let recordsTotal = await Location.countDocuments().exec();

  // populate_below_3

  sendResponse(res, true, result);
};

module.exports = {
  getPaginatedLocation,
}