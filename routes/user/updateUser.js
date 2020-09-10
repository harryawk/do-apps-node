const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const { removeFileInUser, updateUserFile } = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_SECRET;
const populationSettings = Config['populator']['user'];


const updateUser = async (req, res) => {
  
  let UserID = req.params.user_id;
  // let updatedData = req.body.new_data

  let updatedData = req.body;

  // updatedData = Util.insertDatetimeInBody(updatedData);

  // if ('location' in updatedData) {
  //   let locationName = await Location.findOne({ _id: mongoose.Types.ObjectId(updatedData['location']) });
  //   if (!('name' in locationName)) {
  // 
  //     sendResponse(res, false, 'Kabupaten / Kota tersebut tidak ditemukan. Harap hubungi admin.');
  // 
  //     return;
  //   }
  // }

  if ('deleted_urls' in updatedData) {
    updatedData = await removeFileInUser(updatedData);
    updatedData = await updateUserFile(req, updatedData);
  } else {
    updatedData = await updateUserFile(req, updatedData);
  }

  let updatedUser = {};
  try {
    updatedUser = await User.findByIdAndUpdate(UserID, updatedData, {new: true});

    for (let populationSetting of populationSettings) {
      updatedUser = await User.populate(updatedUser, populationSetting);
    }
  } catch (err) {
    console.log('error');
    console.log(err);

    sendResponse(res, false, String(err));
    return;
  }

  sendResponse(res, true, updatedUser);
};

module.exports = {
  updateUser,
};