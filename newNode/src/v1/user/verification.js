import pool from '../../db/db';
import {responseWithError, respondWithData} from '../../utils/response';

export async function verifyEmailExist(request, response) {
  try {
    let authToken = request.body.token
    console.log(authToken)
    let emailId = request.body.emailId
    if (emailId === null || emailId === undefined || emailId === '') throw 'Invalid email address';
    let userId = (authToken === undefined || authToken === '') ? 0 : await getUserIdFromToken(authToken);
    let client = await pool();
    try {
      if (userId === undefined) throw 'Invalid token';

      let data = await client.query(`SELECT jf_user_id FROM jf_user_details WHERE LOWER(email_id) = '${emailId.toLowerCase()}' AND jf_user_id <> ${userId}`);

      respondWithData(data.rows[0] === undefined ? null : data.rows[0].jf_user_id, data.rows[0] === undefined ? 'Email is unique' : 'Email address exist', response)
      return
    } catch (error) {
      console.log(error)
      responseWithError(error, response)
      return
    } finally {
      client.release(true)
      return
    }
  } catch (error) {
    responseWithError(error, response)
    return
  }
}

export async function updateUserDetails (request, response) {
  try {
    let authToken = request.body.token;
    let userData = JSON.parse(request.body.userDetails);
    
    let client = await pool()
    
    try {
      if (authToken === undefined || authToken === null) throw 'Invalid token';
      // getting userid from authtoken
      let userId = await getUserIdFromToken(authToken);
      if (userId === undefined) throw 'Invalid token'
      // getting olde email address as user can change email address
      let olderEmailAddress = await client.query(`SELECT email_id FROM jf_user_details WHERE jf_user_id = ${userId}`)
      // if user email address is changed
      let query = `UPDATE jf_user_details SET full_name = '${userData.userName}', email_id = '${userData.emailId}', phone_number = '${userData.phoneNumber}', dob = '${userData.dob}'`

      query += olderEmailAddress.rows[0].email_id !== userData.emailId ? ', email_verified = false' : ''
      console.log(query)
      let data = await client.query(`${query} WHERE jf_user_id = ${userId}`)

      respondWithData(null, 'Updated successfully', response)
      return
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


export async function getUserIdFromToken (token) {
  let client = await pool()
  let userId
  try {
    let data = await client.query(`SELECT jf_user_id FROM jf_user_auth_details WHERE authtoken = '${token}'`);
    if (data.rows[0] === undefined) throw 'Invalid token'
    userId = data.rows[0].jf_user_id
  } catch (error) {
    throw error
  } finally {
    client.release(true)
    return userId
  }
}