const List = require('../models/list');
const { cleanHTML } = require('../helpers/controllerHelpers');

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
      return res.status(404).json({ error: 'No lists found for this user.' });
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
      return res.status(401).json({ error: 'Your request did not return a public list.' });
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
    const { html, name, backgroundColor, updatedAt, notificationsOn, isPrivate } = req.body;
    const { user } = req;
    // Sanitize HTML before inserting
    const clean = await cleanHTML(html);
    const newList = new List({
      name, backgroundColor, updatedAt, notificationsOn, isPrivate, html: clean, authorId: user
    });
    await newList.save((err, list) => {
      if (err) return `Error occurred while saving ${err}`;
      // respond with the list
      return res.status(200).json({ list });
    });
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
    const { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = req.body;
    const { user } = req;
    const list = await List.findById(id);
    // Make sure list belongs to user
    if (list.authorId.toString() !== user) {
      return res.status(401).json({ error: 'This list cannot be edited by this user.' });
    }
    // Sanitize HTML before inserting
    const clean = cleanHTML(html);
    await list.updateOne({ name, html: clean, backgroundColor, notificationsOn, isPrivate, updatedAt });
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
      return res.status(401).json({ error: 'This list cannot be edited by this user.' });
    }
    // Change shared status in database
    list.isPrivate = !list.isPrivate;
    await list.save();
    const resMsg = list.isPrivate ? 'Your list is now private.' : 'A link to your list has been copied to your clipboard. Share it with whomever you like!';
    res.status(200).json({ msg: resMsg });
  } catch (error) {
    throw new Error(error);
  }
};

//TODO: handle copy of shared list
const copyList = async (req, res) => {
  try {
    // Get the list
    const { id } = req.params;
    const list = await List.findById(id);
    // Check if list is private
    if (list.isPrivate) {
      return res.status(401).json({ error: 'This list is private' });
    }
    // Get user who wants to make a copy
    const { user } = req;
    // Check if the user is the same as the creator
    if (user === list.authorId) {
      return res.status(401).json({ error: 'This is your list.' });
    }
    // Check if user already has this list
    const query = await List.find({ authorId: user, copiedFrom: id });
    if (query.length > 0) {
      console.log(query.length);
      return res.status(401).json({ error: 'You already have a copy of this list' });
    }
    // Make the copy
    const { name, html, backgroundColor } = list;
    const listCopy = new List({
      name, html, backgroundColor, authorId: user, copiedFrom: id, isFinished: false
    });
    await listCopy.save((err, list) => {
      if (err) return `Error occurred while saving ${err}`;
      // respond with the list
      return res.status(200).json({ list });
    });
  } catch (error) {

  }
};


/**
 * Delete list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const deleteList = async (req, res) => {
  console.log(req.params);
  try {
    // Delete a list
    const list = await List.findByIdAndDelete({ _id: req.params.id });
    if (!list) {
      return res.status(404).json({ error: 'No list found with this id.' });
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
  copyList,
  editList,
  createList,
  updateList,
  deleteList
};