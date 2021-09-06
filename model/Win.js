const mongoose = require('mongoose');

const winSchema = new mongoose.Schema({
  message: String,
  from: String,
  channel: String,
  command: String,
  winner: String,
}, {
  timestamps: true
});

const Win = mongoose.model('Win', winSchema);

module.exports = Win;
