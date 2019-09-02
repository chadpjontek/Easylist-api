const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the list schema
const listSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  html: String,
  backgroundColor: String,
  isPrivate: {
    type: Boolean,
    default: true
  },
  notificationsOn: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  copiedFrom: String,
  isFinished: Boolean
});

// Create a model
const List = mongoose.model('list', listSchema);

// Export the model
module.exports = List;