let router = require('express').Router();
var pool = require('../../db/db');
import {responseWithError, respondWithData} from '../../utils/response';

import DataGenerator from './datamodel'

var dataGenerator;

router.post('/data', async (request, response) => {
  dataGenerator = new DataGenerator();
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let responseData = []
    await loopThroughAddedData(requestData, responseData, 500)
    // setInterval(() => {
    respondWithData(responseData, 'Data successfully generated', response)
    // }, 9000)
  } catch (error) {
    // console.log(dataGenerator.unique_code)
    responseWithError('Invalid JSON value', response)
    // response.send({status: 201, message: 'Invalid JSON value', data: null})
    return
  }
})
router.post('/uncustomized', async (request, response) => {
  dataGenerator = new DataGenerator();
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let responseData = []
    await loopThroughAddedDataUncustomized(requestData, responseData, 500)
    // setInterval(() => {
      respondWithData(responseData, 'Data successfully generated', response)
    // }, 9000)
  } catch (error) {
    console.log(error)
    responseWithError('Invalid JSON value', response)
    return
  }
})
// This is for customized data as data will be return in obj form
async function loopThroughAddedDataUncustomized (data, response, limit) {
  for (let i = 0; i < limit; i++) {
    dataGenerator.resetIndex
    let dataToPush = Array.isArray(response) ? {} : response
    await generateAndFillUncustomized(Object.entries(data), dataToPush)
    if (Array.isArray(response)) response.push(dataToPush)
  }
}

// This is for customized data as data will be return in obj form
async function loopThroughAddedData (data, response, limit) {
  for (let i = 0; i < limit; i++) {
    let dataToPush = Array.isArray(response) ? {} : response
    await generateAndFill(Object.entries(data), dataToPush)
    if (Array.isArray(response)) response.push(dataToPush)
  }
}

async function generateAndFillUncustomized (data, response) {
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
              loopThroughAddedDataUncustomized(data[index][1][0], response[data[index][0]], 10)
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
              loopThroughAddedDataUncustomized(data[index][1], response[data[index][0]], 10)
            }
          }
      }
    }
  } catch (error) {

  }
}
// now lets fill data which have to be generated
async function generateAndFill (data, response) {
  try {
    for (let i = 0; i < data.length; i++) {
      if (data[i][1].value === undefined) return
      if (data[i][1].value === 'text') {
        if (data[i][1].mapTo === 'custom') {
          response[data[i][0]] = data[i][1].getDataFrom[dataGenerator.number(0, data[i][1].getDataFrom.length)]
        } else if (data[i][1].mapTo === 'phone_number') {
          response[data[i][0]] =  `${data[i][1].prefix} ${dataGenerator[data[i][1].mapTo]}`
        } else {
          response[data[i][0]] =  dataGenerator[data[i][1].mapTo] === undefined ? '' : dataGenerator[data[i][1].mapTo]
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
          await loopThroughAddedData(data[i][1].children, response[data[i][0]], 1)
        } else {
          response[data[i][0]] = []
          await loopThroughAddedData(data[i][1].children[0], response[data[i][0]], parseInt(data[i][1].len) === NaN ? 1 : parseInt(data[i][1].len))
        }
      }
    }
  } catch (error) {
    throw error
  }
}
// export module
module.exports = router;