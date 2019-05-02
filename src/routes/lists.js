const router = require('express-promise-router')();

const { validateBody, schemas, tokenAuth, userAuth } = require('../helpers/routeHelpers');
const ListsController = require('../controllers/lists');

// ================================================
// NON-PROTECTED ROUTES (no authorization required)
// ================================================
// GET REQUESTS
// ============

// =============
// POST REQUESTS
// =============


// ============================================================
// PROTECTED ROUTES (requires user authorization before access)
// ============================================================
// GET REQUESTS
// ============

// =============
// POST REQUESTS
// =============


// Export the routes
module.exports = router;