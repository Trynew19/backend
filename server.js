require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;



app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(helmet());
app.use(express.json());

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    
  })
  .catch(err => console.error('MongoDB connection error:', err));

const eqRoutes = require('./routes/earthquakes');
app.use('/api/earthquakes', eqRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));