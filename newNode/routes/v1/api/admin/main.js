let router = require('express').Router();

let category = require('./category/category');
router.use('/category', category)

let tableList = require('./tables/api');
router.use('/map', tableList)
module.exports = router;