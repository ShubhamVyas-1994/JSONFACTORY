let router = require('express').Router();
var pool = require('../../db/db');
import {responseWithError, respondWithData} from '../../utils/response';
import {getUserIdFromToken} from '../user/verification.js'
router.post('/add', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.suggestion);
    let client = await pool();
    let query = `INSERT INTO jf_suggestion_log(added_by, suggestion, added_on, jf_user_id) VALUES ('${requestData.addedBy}', '${requestData.suggestion}', '${new Date().toISOString()}', ${requestData.userId})`
    try {
      let data = await client.query(query);
      respondWithData(data.rows, 'Added Successfully', response);
    } catch (error) {
      console.log(query)
      throw error
    } finally {
      client.release(true)
    }
  } catch (error) {
    responseWithError(error, response)
    return
  }
})
router.get('/list', async (request, response) => {
  let authToken = request.query.token
  if (authToken === null || authToken === undefined || authToken === '') {
    respondWithData([], 'Fetched', response)
    return
  }
  let userId = await getUserIdFromToken(authToken)
  if (userId === undefined || userId < 1) {
    respondWithData([], 'Fetched', response)
    return
  }
  let client = await pool()
  try {
    let data = await client.query(`SELECT suggestion_id, added_by, suggestion, added_on FROM jf_suggestion_log WHERE jf_user_id = ${userId}`)
    let responseData = []
    data.rows.forEach(val => {
      responseData.push({
        suggestionId: val.suggestion_id,
        addedBy: val.added_by,
        suggestion: val.suggestion,
        addedOn: val.added_on
      })
    })
    respondWithData(responseData, '', response)
  } catch (error) {
    responseWithError(error, response)
  } finally {
    client.release(true)
    return
  }
})

module.exports = router;