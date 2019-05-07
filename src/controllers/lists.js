const List = require('../models/list');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get lists logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const getLists = async (req, res) => {
  const { user } = req;
  try {
    // Get lists
    const lists = await List.find({ authorId: user });
    if (!lists) {
      return res.status(404).json({ msg: 'No lists found for this user.' });
    }
    res.status(200).json({ lists });
  } catch (error) {
    throw new Error(error);
  }
};

const getList = async (req, res) => {
  // TODO: Get a specific list
  res.status(200).json({ msg: 'Here is the list' });
};

const shareList = async (req, res) => {
  // TODO: Create a shared list
  res.status(200).json({ msg: 'Shared list created' });
};

const editList = async (req, res) => {
  // Edit a specific list - this should be handled on client with React Router and display the list with edit controls
  res.status(200).json({ msg: 'Here is the list to edit' });
};

/**
 * Create list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const createList = async (req, res) => {
  try {
    // Create a list
    const { listName } = req.body;
    const { user } = req;
    const newList = new List({ listName, authorId: user });
    await newList.save();
    res.status(200).json({ msg: `"${listName}" created` });
  } catch (error) {
    throw new Error(error);
  }
};

const updateList = async (req, res) => {
  // Update a specific list
  try {
    const { id } = req.params;
    const { listName, items } = req.body;
    const { user } = req;
    const list = await List.findById(id);
    // Make sure list belongs to user
    if (list.authorId.toString() !== user) {
      return res.status(401).json({ msg: 'This list cannot be edited by this user.' });
    }
    // If the listName has changed, update.
    if (listName) {
      console.log(listName);
      list.listName = listName;
    }
    // If there are items, update.
    if (items) {
      console.log(items);
      list.items = items;
    }
    // Save the list
    list.items = items;
    await list.save();
    res.status(200).json({ msg: 'List updated' });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Delete list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const deleteList = async (req, res) => {
  try {
    // Delete a list
    const list = await List.findByIdAndDelete({ _id: req.params.id });
    if (!list) {
      return res.status(404).json({ msg: 'No list found with this id.' });
    }
    res.status(200).json({ msg: 'List deleted' });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getLists,
  getList,
  shareList,
  editList,
  createList,
  updateList,
  deleteList
};