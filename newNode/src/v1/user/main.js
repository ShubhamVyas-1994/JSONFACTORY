let router = require('express').Router();
import pool from '../../db/db';
import {responseWithError, respondWithData} from '../../utils/response';
import {updateUserDetails, verifyEmailExist} from './verification';
import {getUserPayload, getUserPayloadViaGetMethod, getUserPayloadDetails, getPayloadFromId} from './payload';

router.post('/details', async (request, res) => {
  let client = await pool();
  try {
    let token = request.body.token

    let data = await client.query(`SELECT jf_user_id FROM jf_user_auth_details WHERE authtoken = '${token}'`)
    if (data.rows[0] === undefined) throw 'Invalid token'
    let userId = data.rows[0].jf_user_id
    
    // getting user entered password while signing up
    let userData = await client.query(`SELECT jf_user_id, full_name, username, email_id, phone_number, gender, dob, added_date, email_verified FROM jf_user_details WHERE jf_user_id = ${userId}`)

    let totalData = await client.query(`SELECT COUNT(payload_id) as total FROM user_payload WHERE jf_user_id = ${userId}`)
    console.log(typeof totalData.rows[0].total)
    if (userData.rows[0] === undefined) throw 'Invalid user id'
    respondWithData({
      userId: userData.rows[0].jf_user_id,
      userName: userData.rows[0].full_name,
      emailId: userData.rows[0].email_id,
      phoneNumber: userData.rows[0].phone_number,
      gender: userData.rows[0].gender,
      dob: userData.rows[0].dob,
      added_date: userData.rows[0].added_date,
      isEmailVerified: userData.rows[0].email_verified,
      savedData: totalData.rows[0] === undefined || totalData.rows[0].total === null ? 0 : totalData.rows[0].total
    }, 'Fetched successfully', res)
    return
  } catch (error) {
    responseWithError(error, res)
    return
  } finally {
    client.release(true)
    return
  }
});

router.post('/details/update', updateUserDetails);

router.post('/verify/email', verifyEmailExist);

router.post('/payload', getUserPayload);
router.get('/payload', getUserPayloadViaGetMethod);
router.post('/saved', getUserPayloadDetails);
router.post('/payload/data', getPayloadFromId);

module.exports = router;