const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  objective: {
    type: mongoose.ObjectId,
    ref: 'Objective',
    autopopulate: { maxDepth: 1 },
  },
  text: String,
  responses: [String],
})

questionsSchema.plugin(require('mongoose-autopopulate'));
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;