let router = require('express').Router();
import EncryptDecrpytPassword from '../../utils/crypto';
import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import {generateAuthToken} from '../../utils/common';

router.post('/login', async (request, res) => {
  let client = await pool();
  try {
    let requestData = JSON.parse(request.body.loginDetails)
    console.log('requestData', requestData)
    // Decrpyted user intered password
    let password  = EncryptDecrpytPassword.getDecryptedPasswordFromUser(requestData.password)
    // getting user entered password while signing up
    let dbData = await client.query(`SELECT password, jf_user_id FROM jf_user_details WHERE email_id = '${requestData.emailId}'`)
    console.log('dbData', dbData)

    if (dbData.rows[0] === undefined) throw 'Invalid email or password'
    let dbEncrpytedPassword = dbData.rows[0].password
    // now decrpyting this password and matching both password if they both are same then loging in else throwing Invalid username or password
    let decrpyPas = await EncryptDecrpytPassword.getDecryptedPassword(dbEncrpytedPassword)
    if (decrpyPas === password) {
      let token = await generateAuthToken(dbData.rows[0].jf_user_id)
      respondWithData(token, 'Login successfull', res)
    } else {
      throw('Invalid username or password')
    }
  } catch (error) {
    responseWithError(error, res)
  } finally {
    console.log('REturn Fired finally didnt run')
    client.release(true)
    return
  }
})

router.post('/signup', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.userDetails)
    if (requestData.password === '') throw 'Invalid password'
    let encryptedPassword = await EncryptDecrpytPassword.getEncryptedPassword(requestData.password)

    let client = await pool();
    try {
      let dbResponse = client.query(`INSERT INTO jf_user_details(full_name, username, email_id, phone_number, gender, dob, password, added_date) VALUES ('${requestData.fullName}', '${requestData.userName}', '${requestData.emailId}'), '${requestData.phoneNumber}', '${requestData.gender}', '${requestData.dob}', '${encryptedPassword}', '${new Date().toISOString()}' RETURNING jf_user_id`)

      let token = generateAuthToken(dbResponse.rows[0].jf_user_id)
      respondWithData(JSON.stringify({userId: dbResponse.rows[0].jf_user_id, token: token}), 'Signup Successful', response)
      return
    } catch (error) {
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
  } finally {
    return
  }
})
// export module
module.exports = router;