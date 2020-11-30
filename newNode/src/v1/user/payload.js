import pool from '../../db/db';
import {responseWithError, respondWithData} from '../../utils/response';
import {getUserIdFromToken} from './verification';

export async function getUserPayload (request, response) {
  try {
    let authToken = request.body.token;
    let offset = parseInt(request.body.offset);
    let limit = parseInt(request.body.limit);
    let orderBy = request.body.orderBy;
    let sortBy = request.body.sortBy;
    let payloadId = parseInt(request.body.payloadId);
    if (isNaN(payloadId) || payloadId < 1) throw 'Invalid paylodId';

    if (authToken === null || authToken === undefined || authToken === '') throw 'Invalid token';
    let userId = await getUserIdFromToken(authToken);
    if (userId.rows[0] === undefined) throw 'Invalid token';

    let query = `SELECT data FROM (SELECT json_array_elements(payload) as data FROM user_payload WHERE payload_id = ${payloadId}) payload `

    if (sortBy !== undefined && sortBy !== null && sortBy !== '' && sortBy !== 'undefined') {
      query += `ORDER BY data->>${sortBy} `
      if (orderBy !== undefined && orderBy !== null && orderBy !== '' && orderBy !== 'undefined') {
        query += ` ${orderBy.toUpperCase()}`  
      }
    }

    if (isNaN(limit) === false && limit !== undefined) {
      query += `LIMIT ${limit}`
    }

    query += `OFFSET ${(isNaN(offset) === false && offset !== undefined) ? offset : 0}`

    let client = await pool();
    try {
      let data = await client.query(query)
      let responseData = []
      for (let i = 0; i < data.rows.length; i++) {
        responseData.push(data.rows[i].data)
      }
      respondWithData(responseData, 'Fetched successfully', response)
      return
    } catch (error) {
      console.log(query)
      throw error
    } finally {
      client.release(true)
      return
    }
  } catch (error) {
    responseWithError(error, response)
  }
}

export async function getUserPayloadViaGetMethod (request, response) {
  try {
    let authToken = request.query.token
    if (authToken === undefined || authToken === null || authToken === '') throw 'Invalid token'

    let payloadId = parseInt(request.query.payloadId)
    if (payloadId === undefined || isNaN(payloadId)) throw 'Invalid Id'

    let userId = await getUserIdFromToken(authToken);
    if (userId === undefined || userId === 0) throw 'Invalid token';

    let offset = parseInt(request.query.offset);
    let limit = parseInt(request.query.limit);
    let orderBy = request.query.orderBy;
    let sortBy = request.query.sortBy;

    let query = `SELECT data FROM (SELECT json_array_elements(payload) as data FROM user_payload WHERE payload_id = ${payloadId}) payload `

    if (sortBy !== undefined && sortBy !== null && sortBy !== '' && sortBy !== 'undefined') {
      query += `ORDER BY data->>'${sortBy}' `
      if (orderBy !== undefined && orderBy !== null && orderBy !== '' && orderBy !== 'undefined') {
        query += ` ${orderBy.toUpperCase()}`  
      }
    }

    if (isNaN(limit) === false && limit !== undefined) {
      query += ` LIMIT ${limit}`
    }

    query += ` OFFSET ${(isNaN(offset) === false && offset !== undefined) ? offset : 0}`

    let client = await pool();
    try {
      let data = await client.query(query)
      let responseData = []
      for (let i = 0; i < data.rows.length; i++) {
        responseData.push(data.rows[i].data)
      }
      respondWithData(responseData, 'Fetched successfully', response)
      return
    } catch (error) {
      console.log(query, error)
      throw error;
    } finally {
      client.release(true);
    }    
  } catch (error) {
    responseWithError(error, response)
    return
  }
}

export async function getUserPayloadDetails (request, response) {
  try {
    let token = request.body.token
    if (token === '' || token === null || token === undefined) throw 'Invalid token';

    let userId = await getUserIdFromToken(token)
    if (userId === undefined) throw 'Invalid token'

    let client = await pool();
    try {
      let data = await client.query(`SELECT payload_id, added_on, can_order_by, payload_name, total_data FROM user_payload WHERE jf_user_id = ${userId}`)
      let responseData = data.rows.map(val => {
        return {
          payloadId: val.payload_id,
          addedOn: val.added_on,
          canOrderBy: val.can_order_by,
          payloadName: val.payload_name,
          total: val.total_data
        }
      })
      respondWithData(responseData, 'Fetched successfully', response)
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

export async function getPayloadFromId (request, response) {
  try {
    let token = request.body.token
    if (token === '' || token === null || token === undefined) throw 'Invalid token';

    let userId = await getUserIdFromToken(token)
    if (userId === undefined) throw 'Invalid token'

    let payloadId = parseInt(request.body.payloadId);
    if (payloadId === NaN || payloadId < 1) throw 'Invalid payload Id';

    let client = await pool();
    try {
      let data = await client.query(`SELECT payload FROM user_payload WHERE payload_id = ${payloadId}`)
      if (data.rows[0].payload === undefined) throw 'Invalid payload Id'
      respondWithData(data.rows[0].payload, 'Fetched successfully', response)
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