let router = require('express').Router();
const pool = require('../db/db');
var fs = require('fs');
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

let suggest = require('./suggestion/index');
router.use('/feedback', suggest);

router.get('/user', async (req, res) => {
  let client = await pool();
  try {
    let data = await client.query('SELECT company_name FROM company_details ORDER BY random()');
    fs.writeFileSync('./company.json', JSON.stringify(data.rows), 'utf8');
    res.send(data.rows)

  } catch (error) {
    res.send(error)
  } finally {
    client.release(true)
  }
})

module.exports = router;