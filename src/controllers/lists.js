const List = require('../models/list');
const getLists = async (req, res) => {
  const { user } = req;
  // TODO: Get the lists of the user
  res.status(200).json({ msg: `Here are ${user}'s lists'` });
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
  // TODO: Edit a specific list
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
  // TODO: Update a specific list
  res.status(200).json({ msg: 'List updated' });
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