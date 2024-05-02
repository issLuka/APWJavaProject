const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/leaderboards', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
const thermiteRouter = require('./routes/thermite');
app.use('/thermite', thermiteRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});