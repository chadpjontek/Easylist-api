const List = require('../models/list');
const User = require('../models/user');
const { cleanHTML, sendListCompletionNotification } = require('../helpers/controllerHelpers');
const { STATIC_URL } = process.env;
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
  const { user } = req;
  try {
    const { id } = req.params;
    const list = await List.findById(id)
      .where('authorId').equals(user);
    if (!list) {
      return res.status(401).json({ error: 'Your request did not return a list.' });
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
    const { html, name, backgroundColor, updatedAt, notificationsOn, isPrivate, isFinished, copiedFrom } = req.body;
    const { user } = req;
    // Sanitize HTML before inserting
    const clean = await cleanHTML(html);
    const newList = new List({
      name, backgroundColor, updatedAt, notificationsOn, isPrivate, html: clean, authorId: user, isFinished, copiedFrom
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
    const { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt, isFinished, copiedFrom } = req.body;
    const { user } = req;
    const list = await List.findById(id);
    // Make sure list belongs to user
    if (list.authorId.toString() !== user) {
      return res.status(401).json({ error: 'This list cannot be edited by this user.' });
    }
    // Sanitize HTML before inserting
    const clean = cleanHTML(html);
    await list.updateOne({ name, html: clean, backgroundColor, notificationsOn, isPrivate, updatedAt, isFinished, copiedFrom });
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
    const link = `${STATIC_URL}/lists/${id}/shared`;
    res.status(200).json({
      msg: resMsg,
      link
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get copy logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const getCopy = async (req, res) => {
  try {
    // Get the list
    const { id } = req.params;
    const list = await List.findById(id);
    // Make sure there is a list
    if (!list) {
      return res.status(401).json({ error: 'Your request did not return a list.' });
    }
    // Check if list is private
    if (list.isPrivate) {
      return res.status(401).json({ error: 'This list is private' });
    }
    // Make the copy
    const { name, html, backgroundColor } = list;
    list.copiedFrom = id;
    list.isFinished = false;
    // respond with the list
    return res.status(200).json({ list });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Complete list logic
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const completeList = async (req, res) => {
  // Complete a specific list
  try {
    const { id } = req.params;
    const { user } = req;
    const list = await List.findById(id);
    // exit if already finished
    if (list.isFinished) return res.status(401).json({ error: 'already finished' });
    // find the user who shared list
    const originalList = await List.findById(list.copiedFrom);
    // exit if notifications are off
    if (!originalList.notificationsOn) return res.status(401).json({ error: 'notifications off' });
    const sharedBy = await User.findById(originalList.authorId);
    // find the username of the user who finished the list
    const finishedBy = await User.findById(user);
    await sendListCompletionNotification(list.name, sharedBy.email, sharedBy.username, finishedBy.username);
    // Change the finished status to true
    list.isFinished = true;
    await list.save();
    res.status(200).json({ list });
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
  getCopy,
  editList,
  createList,
  updateList,
  completeList,
  deleteList
};