const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  command: String,
  channel: String,
  user: String,
}, {
  timestamps: true
});

const Raffle = mongoose.model('Raffle', raffleSchema);

module.exports = Raffle;
