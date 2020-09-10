const sendResponse = (sender, successStatus, payload, recordsTotal = 0) => {
  let response = {};

  response['data'] = {};
  response['recordsTotal'] = 0;
  response['recordsTotalExist'] = false;

  response['data']['success'] = successStatus;
  
  if (successStatus === true) {
      response['data']['payload'] = payload;
      if (payload instanceof Object && payload instanceof Array) {
          response['recordsTotal'] = recordsTotal;
          response['recordsTotalExist'] = true;
      }

      sender.send(response);
  } else {
      response['data']['error'] = payload;
      sender.send(response);
  }

};

module.exports = {
  sendResponse,
}