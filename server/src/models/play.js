const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaySchema = new Schema({
  userId: { type: String, required: true },
  songId: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Play', PlaySchema);
