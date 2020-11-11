let router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello FROM AUTH')
})

// export module
module.exports = router;