let router = require('express').Router();
var pool = require('../../db/db');

import DataGenerator from './datamodel'

router.post('/data', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let responseData = []
    await loopThroughAddedData(requestData, responseData, 500)
    // setInterval(() => {
      response.send({status: 200, message: 'Data successfully generated', data: responseData})
    // }, 9000)
  } catch (error) {
    console.log(DataGenerator.unique_code)

    console.log(error)
    response.send({status: 201, message: 'Invalid JSON value', data: null})
    return
  }
})

async function loopThroughAddedData (data, response, limit) {
  for (let i = 0; i < limit; i++) {
    let dataToPush = Array.isArray(response) ? {} : response
    await generateAndFill(Object.entries(data), dataToPush)
    if (Array.isArray(response)) response.push(dataToPush)
  }
}

// now lets fill data which have to be generated
async function generateAndFill (data, response) {
  try {
    for (let i = 0; i < data.length; i++) {
      if (data[i][1].value === undefined) return
      if (data[i][1].value === 'text') {
        if (data[i][1].mapTo === 'custom') {
          response[data[i][0]] = data[i][1].getDataFrom[DataGenerator.number(0, data[i][1].getDataFrom.length)]
        } else if (data[i][1].mapTo === 'phone_number') {
          response[data[i][0]] =  `${data[i][1].prefix} ${DataGenerator[data[i][1].mapTo]}`
        } else {
          response[data[i][0]] =  DataGenerator[data[i][1].mapTo] === undefined ? '' : DataGenerator[data[i][1].mapTo]
        }
      } else if (data[i][1].value !== 'object' && data[i][1].value !== 'array' && data[i][1].value !== 'arrayOfObjects') {
        switch (data[i][1].value) {
          case 'number':
            response[data[i][0]] = data[i][1].isUniqueId ? DataGenerator.uniqueId : DataGenerator.number(data[i][1].min, data[i][1].max);
            break;
          case 'float':
            response[data[i][0]] = DataGenerator.float(data[i][1].min, data[i][1].max);
            break;
          case 'boolean':
            response[data[i][0]] = DataGenerator.boolean
            break;
          case 'date_time':
            response[data[i][0]] = DataGenerator.date_time(data[i][1].from, data[i][1].to);
            break;
          default:
            response[data[i][0]] = ''
            break;
        }
      } else if (data[i][1].value === 'custom' || data[i][1].value === 'array') {
          response[data[i][0]] = [DataGenerator[data[i][1].mapTo]]
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