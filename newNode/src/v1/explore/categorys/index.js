let router = require('express').Router();
var pool = require('../../../db/db');
import { token } from 'morgan';
import {getUserIdFromToken} from '../../user/verification';
import {responseWithError, respondWithData} from '../../../utils/response';

router.post('/list', async (request, response) => {
  try {
    let authToken = request.body.token
    if (authToken === undefined || authToken === null) throw 'Invalid token'
    let userId = await getUserIdFromToken(token)

  } catch (error) {
    responseWithError(error, response)
  }
})

module.exports = router;