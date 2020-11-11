let router = require('express').Router();
var pool = require('../../../../db');

import DataGenerator from './datamodel'

router.post('/data', async (request, response) => {
  try {
    let requestData = JSON.parse(request.body.dataMapStructure)
    let responseData = []
    await loopThroughAddedData(requestData, responseData, 500)
    response.send({status: 200, message: 'Data successfully generated', data: responseData})
  } catch (error) {
    response.send({status: 201, message: 'Invalid JSON value', data: null})
    return
  }
})

async function loopThroughAddedData (data, response, limit) {
  let dataToExtract = await sepratingDataToExtract(data)
  let dataToGenerate = await sepratingDataToGenerate(data)
  if (dataToExtract.length > 0) {
    let queryAndValues = await createQuery(dataToExtract)
    try {
      let tableData = await pool.query(queryAndValues[0] + ` ORDER BY random() LIMIT ${limit}`)
      for (let i = 0; i < tableData.rows.length; i++) {
        let dataToPush = Array.isArray(response) ? {} : response
        for (let o = 0; o < queryAndValues[1].length; o++) {
          dataToPush[queryAndValues[1][o].key] = tableData.rows[i][queryAndValues[1][o].columnName]
        }
        try {
          await generateAndFill(dataToGenerate, dataToPush)
        } catch (error) {
          console.log('Error while generating', error)
          throw error
        } finally {
          if (Array.isArray(response)) response.push(dataToPush)
        }
      }
    } catch (error) {
      throw error
    } finally {
      pool.release
    }
  } else {
    for (let i = 0; i < limit; i++) {
      let dataToPush = Array.isArray(response) ? {} : response
      await generateAndFill(dataToGenerate, dataToPush)
      if (Array.isArray(response)) response.push(dataToPush)
    }
  }

}
// separtes data to be extracted from database
async function sepratingDataToExtract (data) {
  return Object.entries(data).filter(val => {
    return val[1].value === 'text' && val[1].extractFrom !== ''
  })
}
// separtes data to be generated using data generator function
async function sepratingDataToGenerate (data) {
  return Object.entries(data).filter(val => {
    return val[1].extractFrom === undefined || val[1].extractFrom === ''
  })
}

// once we extract data now its time to create query for extracting
async function createQuery (data) {
  try {
    let columsquery = 'SELECT '
    let tablequery = ' FROM '
    // track of data keys from table
    let keyAndColumnName = []
    let length = data.length

    for (let i = 0; i < data.length; i++) {
      columsquery +=  length - 1 === i ? `${data[i][1].mapTo}` : `${data[i][1].mapTo}, ` 
      keyAndColumnName.push({key: data[i][0], columnName: data[i][1].mapTo})
    }
    for (let i = 0; i < length; i++) {
      let indexFound = data.findIndex(val => {
        return val[1].extractFrom === data[i][1].extractFrom
      })
      // console.log('IndexFound', indexFound)
      if (indexFound === i && indexFound !== -1) {
        tablequery += i === 0 ? data[i][1].extractFrom : ` LEFT JOIN ${data[i][1].extractFrom} ON (${getIdForSpecificTable(data[i][1].extractFrom)} = ${getIdForSpecificTable(data[i - 1][1].extractFrom)})`
      }
    }
   let query = columsquery + tablequery
   return [query, keyAndColumnName]
  } catch (error) {
    throw error
  }
}

// switch for getting id for tables
function getIdForSpecificTable (tablename) {
  switch (tablename) {
    case 'user_details':
      return 'user_id'
    case 'address_details':
      return 'address_id'
  }
}

// now lets fill data which have to be generated
async function generateAndFill (data, response) {
  try {
    for (let i = 0; i < data.length; i++) {
      if (data[i][1].value === undefined) return
      if (data[i][1].value === 'text') {
        response[data[i][0]] = data[i][1].mapTo === 'phone_number' ? `${data[i][1].prefix} ${DataGenerator[data[i][1].mapTo]}` : DataGenerator[data[i][1].mapTo]
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

  }
}
// export module
module.exports = router;