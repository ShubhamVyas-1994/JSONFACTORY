let router = require('express').Router();

// login, Signup will be handled here
let authR = require('./auth/auth');
router.use('/auth', authR);

// Only For Admin users
let admin = require('./admin/main');
router.use('/admin', admin);

// Data generation will be handled here
let dataG = require('./generate/index');
router.use('/generate', dataG);

// Explore
let exploreG = require('./explore/main');
router.use('/explore', exploreG);

module.exports = router;