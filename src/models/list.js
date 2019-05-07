const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create item schema
const itemSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  linkedListId: String,
  notificationsOn: {
    type: Boolean,
    default: false
  },
  orderedListOn: {
    type: Boolean,
    default: false
  },
  checkboxOn: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create the list schema
const listSchema = new Schema({
  listName: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [itemSchema],
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