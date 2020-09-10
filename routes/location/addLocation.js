const mongoose = require('mongoose');
const Location = require('../../models/location');
const { validateLocationBody, generateLocation } = require('../../utils/location');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');

const addLocation = async (req, res) => {

  let reqBody = req.body;

  let errorMessages = validateLocationBody(reqBody);

  if (errorMessages.length > 0) {
    sendResponse(res, false, errorMessages);
    return;
  }

  let GeneratedLocationID = new mongoose.Types.ObjectId();
  let result = new Location(await generateLocation(req, GeneratedLocationID));

  try {
    await result.save();

    // populate_below_0

  } catch (err) {
    console.log('error');
    console.log(err);
    sendResponse(res, false, String(err));
    return;
  }

  // For Debugging Purpose
  // console.log(req.files)
  // console.log(req.file)

  sendResponse(res, true, result.toObject());
};

module.exports = {
  addLocation,
};