const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  playlist: {
    type: mongoose.ObjectId,
    ref: 'Playlist',
    autopopulate: { maxDepth: 1 },
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    autopopulate: true,
  },
  possibleScore: Number,
  score: Number,
  timeCreated: Date,
  timeScored: Date,
  scoredBy: {
    type: mongoose.ObjectId,
    ref: 'Playlist',
  },
})

scoreSchema.plugin(require('mongoose-autopopulate'));
scoreSchema.options.selectPopulatedPaths = false;
const Score = mongoose.model('Score', scoreSchema)
module.exports = Score;