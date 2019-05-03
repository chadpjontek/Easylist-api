const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const listSchema = new Schema({
  listName: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [],
  url: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create a model
const List = mongoose.model('list', listSchema);

// Export the model
module.exports = List;