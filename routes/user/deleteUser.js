const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const { removeFileInUser } = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];

const deleteUser = async (req, res) => {

  let UserID = req.params.user_id;

  try {
    let deletedData = await User.findByIdAndDelete(UserID);
    await removeFileInUser(deletedData);
  } catch (err) {
    console.log(err);
    sendResponse(res, false, String(err));

    return;
  }

  sendResponse(res, true, {});
};

module.exports = {
  deleteUser,
}