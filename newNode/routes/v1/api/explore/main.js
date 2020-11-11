let router = require('express').Router();

// login, Signup will be handled here
let category = require('./categorys/index');
router.use('/category', category);

// Only For Admin users
let subcategory = require('./subcategory/index');
router.use('/subcategory', subcategory);

module.exports = router;