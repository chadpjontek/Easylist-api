const List = require('../models/list');

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

/**
 * Get list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res HTTP response object
 */
const getList = async (req, res) => {
  // Get list to edit if public
  try {
    const { id } = req.params;
    const list = await List.findById(id)
      .where('isPrivate').equals(false);
    if (!list) {
      return res.status(401).json({ msg: 'Your request did not return a public list.' });
    }
    res.status(200).json({ list });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Edit list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res HTTP response object
 */
const editList = async (req, res) => {
  // Edit a specific list - this should be handled on client with React Router and display the list with edit controls
  // Get list to edit
  const { id } = req.params;
  const list = await List.findById(id);
  res.status(200).json({ list });
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

/**
 * Update list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
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
 * Share list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const shareList = async (req, res) => {
  // Toggle whether the list is shared or not
  try {
    // Get the list
    const { id } = req.params;
    const { user } = req;
    const list = await List.findById(id);
    // Make sure list belongs to user
    if (list.authorId.toString() !== user) {
      return res.status(401).json({ msg: 'This list cannot be edited by this user.' });
    }
    // Change shared status in database
    list.isPrivate = !list.isPrivate;
    await list.save();
    const resMsg = list.isPrivate ? 'Your list is now private.' : 'Your list is now shareable.';
    res.status(200).json({ msg: resMsg });
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