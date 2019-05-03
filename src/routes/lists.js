const router = require('express-promise-router')();

const { validateBody, schemas, tokenAuth, userAuth } = require('../helpers/routeHelpers');
const ListsController = require('../controllers/lists');

// ================================================
// NON-PROTECTED ROUTES (no authorization required)
// ================================================
// GET REQUESTS
// ============

/**
 * GET /lists/:id
 * get list route
 * call getList controller
 */
router.route('/:id')
  .get(ListsController.getList);
// =============
// POST REQUESTS
// =============

/**
 * POST /lists/:id/share
 * createList route
 * Authenticate with token before calling createList controller
 */
router.route('/:id/share')
  .post(ListsController.shareList);


// ============================================================
// PROTECTED ROUTES (requires user authorization before access)
// ============================================================
// GET REQUESTS
// ============

/**
 * GET /lists
 * lists route
 * Authenticate with token before calling lists controller
 */
router.route('/')
  .get(tokenAuth(), ListsController.getLists);

/**
 * GET /lists/:id/edit
 * editList route
 * Authenticate with token before calling editList controller
 */
router.route('/:id/edit')
  .get(tokenAuth(), ListsController.editList);

// =============
// POST REQUESTS
// =============

/**
 * POST /lists/:id/create
 * createList route
 * Authenticate with token before calling createList controller
 */
router.route('/:id/create')
  .post(tokenAuth(), ListsController.createList);

/**
 * POST /lists/:id/update
 * updateList route
 * Authenticate with token before calling updateList controller
 */
router.route('/:id/update')
  .post(tokenAuth(), ListsController.updateList);

// ===============
// DELETE REQUESTS
// ===============

/**
 * DELETE /lists/:id/delete
 * deleteList route
 * Authenticate with token before calling deleteList controller
 */
router.route('/:id/delete')
  .delete(tokenAuth(), ListsController.deleteList);


// Export the routes
module.exports = router;