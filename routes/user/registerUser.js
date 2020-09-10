const mongoose = require('mongoose');
const User = require('../../models/user');
const Location = require('../../models/location');
const { validateUserBody, generateUser } = require('../../utils/user');
const Config = require('../../helpers/config');
const { sendResponse } = require('../../helpers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.AUTH_SECRET;
const hashLength = parseInt(process.env.HASH_LENGTH);
const populationSettings = Config['populator']['user'];

const registerUser = async (req, res) => {

  let reqBody = req.body;

  let errorMessages = validateUserBody(reqBody);

  if (errorMessages.length > 0) {
    sendResponse(res, false, errorMessages);
    return;
  }
  
  // let locationName = await Location.findOne({_id: mongoose.Types.ObjectId(reqBody['location'])});
  // if (!('name' in locationName)) {
  //   
  //   sendResponse(res, false, 'Kabupaten / Kota tersebut tidak ditemukan. Harap hubungi admin.');
  // 
  //   return;  
  // }
  
  // let old_filename = Util.getFirstUploadedFilename(req);

  let salt = bcrypt.genSaltSync(hashLength);
  if ('password' in reqBody) {
    let passwordData = reqBody['password'];
    req.body.password = bcrypt.hashSync(passwordData, salt);
  }

  let GeneratedUserID = new mongoose.Types.ObjectId();
  let UserInstance = new User (await generateUser(req, GeneratedUserID));

  try {
    await UserInstance.save();

    for (let populationSetting of populationSettings) {
      UserInstance = await User.populate(UserInstance, populationSetting);
    }

  } catch (err) {
    console.log('error');
    console.log(err);

    let errorMessage = err.message;
    if (err.code === 11000) {
      errorMessage = 'The Email / Username taken';
    }

    // if (old_filename !== '') {
    //   Util.removeFile(`./public/uploads/${old_filename}`);
    // }

    sendResponse(res, false, errorMessage);
    return;
  }

  // For Debugging Purpose
  // console.log(req.files)
  // console.log(req.file)

  sendResponse(res, true, UserInstance.toObject());
};

module.exports = {
  registerUser,
};