const mongoose = require('mongoose');
const Location = require('../../models/location');
const Util = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const deleteLocation = async (req, res) => {

  let LocationID = req.params.location_id;

  try {
    await Location.findByIdAndDelete(LocationID);
  } catch (err) {
    sendResponse(res, false, err);

    return;
  }

  sendResponse(res, true, {});
};

module.exports = {
  deleteLocation,
};