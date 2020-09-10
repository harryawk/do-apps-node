let mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },

  // new_attribute_above
},
{
  timestamps: true,
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;