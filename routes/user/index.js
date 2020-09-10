// insert_new_below_1

let { deleteUser } = require('./deleteUser');
let { getAllUser } = require('./getAllUser');
let { getAllUserNoFilter } = require('./getAllUserNoFilter');
let { getDetailUser } = require('./getDetailUser');
let { getPaginatedUser } = require('./getPaginatedUser');
let { loginUser } = require('./loginUser');
let { registerUser } = require('./registerUser');
let { updateUser } = require('./updateUser');

module.exports = {
  // insert_new_below_2

  deleteUser,
  getAllUser,
  getAllUserNoFilter,
  getDetailUser,
  getPaginatedUser,
  loginUser,
  registerUser,
  updateUser,
};