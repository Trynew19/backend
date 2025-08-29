const mongoose = require('mongoose');

const EarthquakeSchema = new mongoose.Schema({
  usgsId: { type: String, unique: true },
  place: String,
  mag: Number,
  time: Date,
  coordinates: [Number], // [longitude, latitude]
});

module.exports = mongoose.model('Earthquake', EarthquakeSchema);
