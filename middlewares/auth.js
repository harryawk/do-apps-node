const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = process.env.AUTH_SECRET;

module.exports = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    } else {
      sendResponse(res, false, 'Auth token is not provided');
      return;
    }
  } else {
    sendResponse(res, false, 'Auth token is not provided');
    return;
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        sendResponse(res, false, 'Token is invalid');
        return;
      } else {
        if (!('username' in decoded) || !('password' in decoded)) {
          sendResponse(res, false, 'Token is invalid');
          return;
        }
        User.find({username: decoded.username, password: decoded.password}).then((resultUser) => {
          // console.log(resultUser);
          // console.log(resultUser.length);
          // console.log(decoded);
          if (resultUser.length > 0) {
            req.decoded = decoded;
            req.userObject = resultUser;
            
            next();
          } else {
            sendResponse(res, false, 'User data is invalid');
          }
        }).catch((err) => {
          console.log('error');
          console.log(err);
          sendResponse(res, false, 'User data is invalid');
        });
        // console.log('decoded')
        // console.log(decoded)
      }
    });
  } else {
    sendResponse(res, false, 'Auth token is not provided');
    return;
  }
};