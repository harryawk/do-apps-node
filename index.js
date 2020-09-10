
const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
const uploadPathFilesystem = 'public/uploads';


const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })

if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // console.log('=== start of destination ====')
    
    // console.log(req.headers)
    // console.log(file)
    
    if (fs.existsSync(uploadPathFilesystem)) {
      cb(null, uploadPathFilesystem);
    } else {
      fs.mkdirSync(uploadPathFilesystem);
      cb(null, uploadPathFilesystem);
    }
    // console.log('=== end of destination ====')
  },
  filename: function(req, file, cb) {
    // console.log('=== start of filename ====')
    
    // console.log(req.headers)
    // console.log(file)
    
    cb(null, `uploaded-${Date.now()}-${file.originalname}`);
    // console.log('=== end of filename ====')
  }
});

const upload = multer({
  storage: storage
});

const authMiddleware = require('./middlewares/auth');

const port = process.env.APP_PORT || process.env.PORT || 9999;

const {
  getAllLocation,
  getAllLocationNoFilter,
  getPaginatedLocation,
  getDetailLocation,
  addLocation,
  updateLocation,
  deleteLocation,
} = require('./routes/location');
const {
  getAllUser,
  getAllUserNoFilter,
  getDetailUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require('./routes/user');
// route_goes_here (sorted by newest route)
app.get('/user/all', getAllUser);
app.get('/user/no_filter', getAllUserNoFilter);
app.get('/user/detail/:user_id', getDetailUser);
app.post('/user/register', upload.any(), registerUser);
app.post('/user/login', loginUser);
app.put('/user/:user_id', authMiddleware, upload.any(), updateUser);
app.delete('/user/:user_id', authMiddleware, deleteUser);

app.get('/location/all', getAllLocation);
app.get('/location/no_filter', getAllLocationNoFilter);
app.get('/location/page/:page', getPaginatedLocation);
app.get('/location/detail/:location_id', getDetailLocation);
app.post('/location', addLocation);
app.put('/location/:location_id', updateLocation);
app.delete('/location/:location_id', deleteLocation);

let { sendResponse } = require('./helpers/response');

app.get('/ping', async (req, res) => {
  sendResponse(res, true, 'Server is up and running.');
});

app.listen(port, function() {
  console.log(`App listen on port : ${port}`);
})

module.exports = app;