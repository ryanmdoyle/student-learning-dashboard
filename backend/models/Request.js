const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 },
  },
  playlist: {
    type: mongoose.ObjectId,
    ref: 'Playlist',
    autopopulate: { maxDepth: 1 },
  },
  approved: Boolean,
  approvalAccepted: Boolean,
})

requestSchema.plugin(require('mongoose-autopopulate'));
const Request = mongoose.model('Request', requestSchema);
module.exports = Request;