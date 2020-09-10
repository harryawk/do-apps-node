let mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },

  address: {
    type: String,
    required: true,
  },
  
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },

},
{
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;