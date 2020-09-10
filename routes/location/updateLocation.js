const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const updateLocation = async (req, res) => {

  let LocationID = req.params.location_id;
  // let updatedData = req.body.new_data;

  let updatedData = req.body;

  let result = {};
  try {
    result = await Location.findByIdAndUpdate(LocationID, updatedData, { new: true });

    // populate_below_5
  } catch (err) {
    console.log('error');
    console.log(err);

    sendResponse(res, false, String(err));
    return;
  }

  sendResponse(res, true, result);
};

module.exports = {
  updateLocation,
};