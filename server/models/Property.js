const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
