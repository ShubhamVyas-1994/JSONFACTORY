import {responseWithError, respondWithData} from '../../utils/response';
import pool from '../../db/db';
import EncryptDecrpytPassword from '../../utils/crypto';

export async function getQuestionForReset(request, response) {
  try {
    let emailId = request.body.emailId
    if (emailId === null || emailId === undefined || emailId === '') throw 'Invalid email address'

    let client = await pool()
    try {
      let userData = await client.query(`SELECT jf_user_id, security_question FROM jf_user_details WHERE email_id = '${emailId}'`)
      if (userData.rows[0] === undefined) throw 'Invalid email address'
      
      if (userData.rows[0].security_question === undefined) throw 'Invalid email address'

      respondWithData({
        userId: userData.rows[0].jf_user_id,
        question: userData.rows[0].security_question
      }, 'Fetched successfully', response)
    } catch (error) {
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
  }
}

export async function checkForAnswer(request, response) {
  try {
    let userId = parseInt(request.body.userId)
    if (userId < 1) throw 'Invalid user Id'
    let answer = request.body.answer

    let client = await pool()
    try {
      let data = await client.query(`SELECT jf_user_id FROM jf_user_details WHERE jf_user_id = ${userId} AND answer = '${answer}'`)

      if (data.rows[0] === undefined) throw 'Invalid answer'

      respondWithData(data.rows[0].jf_user_id, 'Right answer', response)
    } catch (error) {
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
  }
}

export async function resetPassword(request, response) {
  try {
    let userId = parseInt(request.body.userId)
    if (userId < 1) throw 'Invalid user Id'
    let password  = await EncryptDecrpytPassword.getDecryptedPasswordFromUser(request.body.password)
    let encryptedPassword = await EncryptDecrpytPassword.getEncryptedPassword(password)
    let client = await pool()
    try {
      let data = await client.query(`UPDATE jf_user_details SET password = '${encryptedPassword}' WHERE jf_user_id = ${userId}`)

      respondWithData(null, 'Password reset successful', response)
    } catch (error) {
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
  }
}