const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const getDetailLocation = async (req, res) => {

  let LocationID = req.params.location_id;

  let result = await Location.findById(LocationID);

  // populate_below_4

  if (result !== null) {
    if (Object.keys(result).length === 0) {
      sendResponse(res, false, 'No such Location Data');
      return;
    }
  } else {
    sendResponse(res, false, 'No such Location Data');
    return;
  }

  sendResponse(res, true, result);

};

module.exports = {
  getDetailLocation,
};