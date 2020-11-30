let router = require('express').Router();
var pool = require('../../db/db');
import { responseWithError, respondWithData } from '../../utils/response';
import { getUserIdFromToken } from '../user/verification'
import cdate from './cdate';
import DataGenerator from './datamodel'

router.post('/data', async (request, response) => {
  let dataGenerator = new DataGenerator();
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let authToken = request.body.token
    let responseData = []
    await loopThroughAddedData(requestData, responseData, 100, dataGenerator)
    // setInterval(() => {
    let payloadDetails = null
    if (authToken !== null && authToken !== undefined && authToken !== '') {
      try {
        payloadDetails = await addIntoUserLog(responseData, authToken, request.body.name, 100);
      } catch (error) {
        throw error;
      }
    }
    respondWithData({ payloadDetails: payloadDetails, payload: responseData }, 'Data successfully generated', response);
    return
    // }, 9000)
  } catch (error) {
    // console.log(dataGenerator.unique_code)
    responseWithError('Invalid JSON value', response)
    // response.send({status: 201, message: 'Invalid JSON value', data: null})
    return
  }
})
router.post('/uncustomized', async (request, response) => {
  let dataGenerator = new DataGenerator();
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let responseData = []
    let authToken = request.body.token
    await loopThroughAddedDataUncustomized(requestData, responseData, 100, dataGenerator)
    // setInterval(() => {
    let payloadDetails = null
    console.log(authToken)
    if (authToken !== null && authToken !== undefined && authToken !== '') {
      console.log('Here I come', authToken !== null, authToken !== undefined, authToken !== '')
      try {
        payloadDetails = await addIntoUserLog(responseData, authToken, request.body.name, 100);
      } catch (error) {
        throw error;
      }
    }
    respondWithData({ payloadDetails: payloadDetails, payload: responseData }, 'Data successfully generated', response);
    return
    // }, 9000)
  } catch (error) {
    console.log(error)
    responseWithError('Invalid JSON value', response)
    return
  }
})

async function addIntoUserLog(data, token, name, limit) {
  let client = await pool();
  let canOrderBy = []
  let payloadId;
  try {
    Object.entries(data[0]).forEach(val => {
      if (typeof val[1] !== 'object') {
        canOrderBy.push(val[0])
      }
    })

    let userId = await getUserIdFromToken(token);
    if (userId === undefined) throw 'Invalid token';
    let payloadData = JSON.stringify(data);
    let deleteDate = cdate.addDaysToDate(new Date().toISOString(), 30);
    let clientData = await client.query(`INSERT INTO user_payload(payload, jf_user_id, added_on, delete_after, can_order_by, payload_name, total_data) VALUES ('${payloadData}', ${userId}, '${new Date().toISOString()}', '${deleteDate}', '${canOrderBy.toString()}', '${name}', ${limit === undefined ? 100 : limit}) RETURNING payload_id`);

    payloadId = clientData.rows[0].payload_id
  } catch (error) {
    throw error
  } finally {
    client.release(true)
  }
  return { payloadId: payloadId, sortdata: canOrderBy.toString() }
}
// This is for customized data as data will be return in obj form
async function loopThroughAddedDataUncustomized(data, response, limit, dataGenerator) {
  for (let i = 0; i < limit; i++) {
    dataGenerator.resetIndex = i
    let dataToPush = Array.isArray(response) ? {} : response
    await generateAndFillUncustomized(Object.entries(data), dataToPush, dataGenerator)
    if (Array.isArray(response)) response.push(dataToPush)
  }
}

// This is for customized data as data will be return in obj form
async function loopThroughAddedData(data, response, limit, dataGenerator) {
  for (let i = 0; i < limit; i++) {
    let dataToPush = Array.isArray(response) ? {} : response
    await generateAndFill(Object.entries(data), dataToPush, dataGenerator)
    if (Array.isArray(response)) response.push(dataToPush)
  }
}

async function generateAndFillUncustomized(data, response, dataGenerator) {
  try {
    for (let index = 0; index < data.length; index++) {
      switch (typeof data[index][1]) {
        case 'string':
          if (data[index][1] !== 'number' && data[index][1] !== 'date_time') {
            response[data[index][0]] = dataGenerator[data[index][1]] === undefined ? '' : dataGenerator[data[index][1]]
          } else {
            response[data[index][0]] = data[index][1] === 'number' ? dataGenerator.number() : dataGenerator.date_time('', '')
          }
          break
        case 'object':
          if (Array.isArray(data[index][1])) {
            response[data[index][0]] = []
            if (typeof data[index][1][0] === 'object') {
              loopThroughAddedDataUncustomized(data[index][1][0], response[data[index][0]], dataGenerator.number(1, 10), dataGenerator)
            } else {
              for (let i = 0; i < 10; i++) {
                if (data[index][1][0] === 'number' && data[index][1][0] === 'date_time') {
                  response[data[index][0]].push(dataGenerator[data[index][1][0]] === undefined ? '' : dataGenerator[data[index][1][0]])
                } else {
                  response[data[index][0]].push(data[index][1][0] === 'number' ? dataGenerator.number() : dataGenerator.date_time())
                }
              }
            }
          } else {
            if (data[index][1].value !== undefined) {
              if (data[index][1].value !== 'number' && data[index][1].value !== 'date_time' && data[index][1].value !== 'custom') {
                response[data[index][0]] = dataGenerator[data[index][1].value] === undefined ? '' : dataGenerator[data[index][1].value]
              } else {
                if (data[index][1].value === 'custom') {
                  response[data[index][0]] = data[index][1].selectFrom === undefined ? '' : data[index][1].selectFrom[dataGenerator.number(0, data[index][1].selectFrom.length)]
                } else {
                  response[data[index][0]] = data[index][1].value === 'number' ? dataGenerator.number(data[index][1].min, data[index][1].max) : dataGenerator.date_time(data[index][1].from, data[index][1].to)
                }
              }
            } else {
              response[data[index][0]] = {}
              loopThroughAddedDataUncustomized(data[index][1], response[data[index][0]], dataGenerator.number(1, 10), dataGenerator)
            }
          }
      }
    }
  } catch (error) {
    throw error;
  }
}
// now lets fill data which have to be generated
async function generateAndFill(data, response, dataGenerator) {
  try {
    for (let i = 0; i < data.length; i++) {
      if (data[i][1].value === undefined) return
      if (data[i][1].value === 'text') {
        if (data[i][1].mapTo === 'custom') {
          response[data[i][0]] = data[i][1].getDataFrom[dataGenerator.number(0, data[i][1].getDataFrom.length)]
        } else if (data[i][1].mapTo === 'phone_number') {
          response[data[i][0]] = `${data[i][1].prefix} ${dataGenerator[data[i][1].mapTo]}`
        } else {
          response[data[i][0]] = dataGenerator[data[i][1].mapTo] === undefined ? '' : dataGenerator[data[i][1].mapTo]
        }
      } else if (data[i][1].value !== 'object' && data[i][1].value !== 'array' && data[i][1].value !== 'arrayOfObjects') {
        switch (data[i][1].value) {
          case 'number':
            response[data[i][0]] = data[i][1].isUniqueId ? dataGenerator.unique_id : dataGenerator.number(data[i][1].min, data[i][1].max);
            break;
          case 'float':
            response[data[i][0]] = dataGenerator.float(data[i][1].min, data[i][1].max);
            break;
          case 'boolean':
            response[data[i][0]] = dataGenerator.boolean
            break;
          case 'date_time':
            response[data[i][0]] = dataGenerator.date_time(data[i][1].from, data[i][1].to);
            break;
          default:
            response[data[i][0]] = ''
            break;
        }
      } else if (data[i][1].value === 'custom' || data[i][1].value === 'array') {
        response[data[i][0]] = [dataGenerator[data[i][1].mapTo]]
      } else if (data[i][1].value === 'object' || data[i][1].value === 'arrayOfObjects') {
        if (data[i][1].value === 'object') {
          response[data[i][0]] = {}
          await loopThroughAddedData(data[i][1].children, response[data[i][0]], 1, dataGenerator)
        } else {
          response[data[i][0]] = []
          await loopThroughAddedData(data[i][1].children[0], response[data[i][0]], parseInt(data[i][1].len) === NaN ? 1 : parseInt(data[i][1].len), dataGenerator)
        }
      }
    }
  } catch (error) {
    throw error
  }
}
// export module
module.exports = router;