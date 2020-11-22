let router = require('express').Router();
const pool = require('../db/db');
import {sendOtp} from '../utils/email';

var fs = require('fs');
// login, Signup will be handled here
let authR = require('./auth/auth');
router.use('/auth', authR);

// Only For Admin users
let categorys = require('./category/category');
router.use('/category', categorys);

let searchKeywords = require('./tables/api');
router.use('/keywords', searchKeywords);

// Data generation will be handled here
let dataG = require('./generate/index');
router.use('/generate', dataG);

// Explore
let exploreG = require('./explore/main');
router.use('/explore', exploreG);

let suggest = require('./suggestion/index');
router.use('/feedback', suggest);

let userRoute = require('./user/main');
router.use('/user', userRoute);

// router.get('/user', async (req, res) => {
//   try {
//     await sendOtp(123123)
//     res.send('Email send successfully')
//   } catch (error) {
//     console.log(error)
//   }
//   // let client = await pool();
//   // try {
//   //   let data = await client.query('SELECT company_name FROM company_details ORDER BY random()');
//   //   fs.writeFileSync('./company.json', JSON.stringify(data.rows), 'utf8');
//   //   res.send(data.rows)

//   // } catch (error) {
//   //   res.send(error)
//   // } finally {
//   //   client.release(true)
//   // }
// })

module.exports = router;