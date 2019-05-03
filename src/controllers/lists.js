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

const createList = async (req, res) => {
  // TODO: Create a specific list
  res.status(200).json({ msg: 'List created' });
};

const updateList = async (req, res) => {
  // TODO: Update a specific list
  res.status(200).json({ msg: 'List updated' });
};

const deleteList = async (req, res) => {
  // TODO: Delete a specific list
  res.status(200).json({ msg: 'List deleted' });
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