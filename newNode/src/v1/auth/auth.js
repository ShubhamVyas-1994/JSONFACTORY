let router = require('express').Router();
import EncryptDecrpytPassword from '../../utils/crypto';
import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import {generateAuthToken} from '../../utils/common';
import {sendEmail} from '../../utils/email';
import CDate from '../generate/cdate';
import {resendEmail} from './email';
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
    console.log('REturn Fired finally didnt run')
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

router.post('/verify/email', async (request, response) => {
  try {
    let token = request.body.token;
    // getting client
    let client = await pool();
    try {
      let userData = await client.query(`SELECT jf_user_id FROM verify_user_via_email WHERE token = '${token}'`)
      if (userData.rows[0] === undefined) throw 'Invalid token'
      
     try {
      await client.query(`UPDATE jf_user_details SET email_verified = true WHERE js_user_id = ${userData.rows[0].jf_user_id}`)
      respondWithData(userData.rows[0].jg_user_id, 'Verified', response)
      return
     } catch (error) {
       console.log(error)
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

router.post('/resent/email', resendEmail)

function returnHtmlForEmail (token, email, date) {
  return `
  <body>
    <div style="background:white;padding:50px;border:solid 1px #f4f4f4;width:500px;">
      <div style="width: 100%;">
        <p style="font-family: system-ui;font-size: 2rem;font-weight: medium;margin-top: 0px;color:rgb(13, 212, 169)">
          Verify your email address
        </p>
        <p style="font-family: system-ui;font-size: 1rem;text-align: left;">
          Thank you for using JSONFACTORY,
          <br>
          <br>
          Please confirm that <b>${email}</b> is your e-mail address by clicking on the button below
        </p>
        <a href="http://localhost:8080/#/emailverified?from=signup&id=${email}&token=${token}" style="padding:15px;margin:40px 0px 0px;background:rgb(13, 212, 169);border: none;color: white;width:500px;display: block;text-align:center;text-decoration: none;font-size:large;">VERIFY</a>
        <p style="font-family: system-ui;font-size: 1rem;text-align: left;">Valid till 48hrs</p>
        </div>
      </div>
</body>
  `
}
// export module
module.exports = router;