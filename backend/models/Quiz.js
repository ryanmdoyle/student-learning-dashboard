const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  playlist: {
    type: mongoose.ObjectId,
    ref: 'Playlist',
    // autopopulate: { maxDepth: 1 },
  },
  questions: [{
    type: mongoose.ObjectId,
    ref: 'Question',
    autopopulate: { maxDepth: 1 },
  }],
  type: {
    type: String,
    enum: ['CREATED', 'EXTERNAL', 'PAPER'],
    default: 'EXTERNAL'
  },
  externalLink: String,
  externalResponsesLink: String,
  possibleScore: Number,
})

quizSchema.plugin(require('mongoose-autopopulate'));
quizSchema.options.selectPopulatedPaths = false;
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;