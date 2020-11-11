let router = require('express').Router();
router.get('/', (req, res) => {
  res.send('Hello')
});
let authR = require('./api/auth/auth');
router.use('/auth', authR);

module.exports = router;