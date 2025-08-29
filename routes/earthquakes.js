const express = require('express');
const axios = require('axios');
const Earthquake = require('../models/Earthquake');
const router = express.Router();

// Fetch and store latest earthquakes
router.get('/sync', async (req, res) => {
  try {
    const { data } = await axios.get(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );

    const validFeatures = data.features.filter(f =>
      Array.isArray(f.geometry?.coordinates) &&
      f.geometry.coordinates.length >= 2 &&
      typeof f.geometry.coordinates[0] === 'number' &&
      typeof f.geometry.coordinates[1] === 'number'
    );

    const operations = validFeatures.map(f => ({
      updateOne: {
        filter: { usgsId: f.id },
        update: {
          usgsId: f.id,
          place: f.properties.place,
          mag: f.properties.mag,
          time: new Date(f.properties.time),
          coordinates: f.geometry.coordinates,
        },
        upsert: true,
      }
    }));

    await Earthquake.bulkWrite(operations);
    res.send({ message: 'Earthquakes synced', count: operations.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync earthquakes' });
  }
});



// Get earthquakes (latest 50)
router.get('/', async (req, res) => {
  const eqs = await Earthquake.find().sort('-time').limit(50);
  res.json(eqs);
});

module.exports = router;
