const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const itemSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  linkedListId: {
    type: Schema.Types.ObjectId,
    ref: 'List'
  },
  notificationsOn: Boolean,
  orderedListOn: Boolean,
  checkboxOn: Boolean,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Create a model
const Item = mongoose.model('item', itemSchema);

// Export the model
module.exports = Item;