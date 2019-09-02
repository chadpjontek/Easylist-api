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
 * POST /lists
 * createList route
 * Authenticate with token before calling createList controller
 */
router.route('/')
  .post(tokenAuth(), validateBody(schemas.createList), ListsController.createList);

/**
* POST /lists/:id/share
* shareList route
* Authenticate with token before calling shareList controller
*/
router.route('/:id/share')
  .put(tokenAuth(), ListsController.shareList);

/**
* POST /lists/:id/copy
* copyList route
* Authenticate with token before calling copyList controller
*/
router.route('/:id/copy')
  .post(tokenAuth(), ListsController.copyList);

// ===============
// UPDATE REQUESTS
// ===============

/**
 * PUT /lists/:id
 * updateList route
 * Authenticate with token before calling updateList controller
 */
router.route('/:id')
  .put(tokenAuth(), validateBody(schemas.updateList), ListsController.updateList);

// ===============
// DELETE REQUESTS
// ===============

/**
 * DELETE /lists/delete
 * deleteList route
 * Authenticate with token before calling deleteList controller
 */
router.route('/:id')
  .delete(tokenAuth(), ListsController.deleteList);


// Export the routes
module.exports = router;