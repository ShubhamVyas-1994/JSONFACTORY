let router = require('express').Router();
import EncryptDecrpytPassword from '../../utils/crypto';
import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import {generateAuthToken} from '../../utils/common';
import {sendEmail} from '../../utils/email';
import CDate from '../generate/cdate';
import {resendEmail, verifyEmail, returnHtmlForEmail} from './email';
import {checkForAnswer, getQuestionForReset, resetPassword} from './resetpassword'

router.post('/login', async (request, res) => {
  let client = await pool();
  try {
    let requestData = JSON.parse(request.body.loginDetails)
    console.log('requestData', requestData)
    // Decrpyted user intered password
    let password  = await EncryptDecrpytPassword.getDecryptedPasswordFromUser(requestData.password)
    // getting user entered password while signing up
    let dbData = await client.query(`SELECT password, jf_user_id FROM jf_user_details WHERE email_id = '${requestData.emailId}'`)
    console.log('dbData', dbData)

    if (dbData.rows[0] === undefined) throw 'Invalid email or password'
    let dbEncrpytedPassword = dbData.rows[0].password
    // now decrpyting this password and matching both password if they both are same then loging in else throwing Invalid username or password
    let decrpyPas = await EncryptDecrpytPassword.getDecryptedPassword(dbEncrpytedPassword)
    console.log(decrpyPas, password)
    if (decrpyPas === password) {
      let token = await generateAuthToken(dbData.rows[0].jf_user_id)
      respondWithData(token, 'Login successfull', res)
    } else {
      throw('Invalid username or password')
    }
  } catch (error) {
    responseWithError(error, res)
  } finally {
    client.release(true)
    return
  }
})

router.post('/signup', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.signupDetails)
    if (requestData.password === '') throw 'Invalid password'
    let decryptedPassword = await EncryptDecrpytPassword.getDecryptedPasswordFromUser(requestData.password)
    let encryptedPassword = await EncryptDecrpytPassword.getEncryptedPassword(decryptedPassword)

    let client = await pool();
    try {
      let query = `INSERT INTO jf_user_details(full_name, username, email_id, phone_number, gender, dob, password, added_date, security_question, answer) VALUES ('${requestData.fullName}', '${requestData.userName}', '${requestData.emailId}', '${requestData.phoneNumber}', '${requestData.gender}', '${requestData.dob}', '${encryptedPassword}', '${new Date().toISOString()}', '${requestData.securityQuestion}', '${requestData.answer}') RETURNING jf_user_id`
      // console.log(query)
      let dbResponse = await client.query(query)
      try {
        let token = await generateAuthToken(dbResponse.rows[0].jf_user_id)
        try {
          let tokenToBeSend = await generateAuthToken(dbResponse.rows[0].jf_user_id)
          // adding log of token generated.
          let x = await client.query(`INSERT INTO verify_user_via_email(token, valid_till,added_on, jf_user_id) VALUES ('${tokenToBeSend}', '${CDate.addDaysToDate(new Date().toISOString(), 2)}', '${new Date().toISOString()}', ${dbResponse.rows[0].jf_user_id})`)
          // sending email to user
          await sendEmail(returnHtmlForEmail(tokenToBeSend, requestData.emailId, CDate.addDaysToDate(new Date().toISOString(), 2)), requestData.emailId)
        } catch (error) {
          console.log('error here')
          throw error
        }
        // sending response of sign up
        respondWithData(JSON.stringify({userId: dbResponse.rows[0].jf_user_id, token: token}), 'Signup Successful', response)
        return
      } catch (error) {
        console.log('error here1')
        throw error
      }
    } catch (error) {
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
    return
  }
})

router.post('/reset/question', getQuestionForReset)

router.post('/reset/verify', checkForAnswer)

router.post('/reset/password', resetPassword)
router.post('/verify/email', verifyEmail)

router.post('/resend/email', resendEmail)

// export module
module.exports = router;