let router = require('express').Router();
var pool = require('../../db/db');
import {responseWithError, respondWithData} from '../../utils/response';

router.post('/add', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.suggestion)
    let client = await pool()
    try {
      let data = await client.query(`INSERT INTO jf_suggestion_log(added_by, suggestion, added_on) VALUES ('${requestData.addedBy}', '${requestData.suggestion}', '${new Date().toISOString()}')`);
      respondWithData(data.rows, 'Added Successfully', response);
    } catch (error) {
      throw error
    } finally {
      client.release(true)
      return
    }
  } catch (error) {
    responseWithError(error, response)
  }
})
router.get('/list', async (request, response) => {
  let client = await pool()
  try {
    let data = await client.query('SELECT suggestion_id, added_by, suggestion, added_on FROM jf_suggestion_log')
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