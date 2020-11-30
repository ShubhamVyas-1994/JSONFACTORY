import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import {generateAuthToken} from '../../utils/common';
import {sendEmail} from '../../utils/email';
import CDate from '../generate/cdate';

export async function resendEmail(request, response) {
  try {
    let emailAddress = request.body.emailAddress;
    if (emailAddress === undefined || emailAddress === null || emailAddress === '') throw 'Invalid email address';

    let client = await pool();
    let userData = await client.query(`SELECT jf_user_id FROM jf_user_details WHERE email_id = '${emailAddress}'`);
    if (userData.rows[0] === undefined) throw 'Invalid email address'
    
    // now send email
    try {
      let tokenToBeSend = await generateAuthToken(userData.rows[0].jf_user_id)
      // adding log of token generated.
      let x = await client.query(`INSERT INTO verify_user_via_email(token, valid_till,added_on, jf_user_id) VALUES ('${tokenToBeSend}', '${CDate.addDaysToDate(new Date().toISOString(), 2)}', '${new Date().toISOString()}', ${userData.rows[0].jf_user_id})`)
      // sending email to user
      await sendEmail(returnHtmlForEmail(tokenToBeSend, emailAddress, CDate.addDaysToDate(new Date().toISOString(), 2)), emailAddress)
    } catch (error) {
      console.log(error)
      throw error
    }
    response.send({status: 200, message: 'Email sent successfully', data: null})
    return
  } catch (error) {
    responseWithError(error, response)
    return
  }
}

export async function verifyEmail(request, response) {
  try {
    let token = request.body.token;
    // getting client
    let client = await pool();
    try {
      let userData = await client.query(`SELECT jf_user_id FROM verify_user_via_email WHERE token = '${token}'`)
      if (userData.rows[0] === undefined) throw 'Invalid token'
      
     try {
      await client.query(`UPDATE jf_user_details SET email_verified = true WHERE jf_user_id = ${userData.rows[0].jf_user_id}`)
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
}


export function returnHtmlForEmail (token, email, date) {
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
        <a href="http://localhost:8080/#/emailverified/${token}" style="padding:15px;margin:40px 0px 0px;background:rgb(13, 212, 169);border: none;color: white;width:500px;display: block;text-align:center;text-decoration: none;font-size:large;">VERIFY</a>
        <p style="font-family: system-ui;font-size: 1rem;text-align: left;">Valid till 48hrs</p>
        </div>
      </div>
</body>
  `
}