const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  playerName: String,
  streak: Number,
  bestTime: Number,
  maxStreak: Number
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);