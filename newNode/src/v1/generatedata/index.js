let router = require('express').Router();
var pool = require('../../db/db');

import GenerateData from './generate'

router.post('/data', async (req, res) => {
  try {
    let requiredData = JSON.parse(req.body.dataMapStructure)
    if (requiredData !== undefined && requiredData !== null) {
      // checking if we have to use db for data
      let dataToGetFromTable = await filteringDataForTable(requiredData)
      let dataToGenerate = await filterDataToGenerate(requiredData)
      // creating response structure
      let responseArray = []
      // checking if table data is represent
      // if not then custom looping will be applied
      if (dataToGetFromTable.length > 0) {
        try {
          await getDataFromTable(dataToGetFromTable, dataToGenerate, responseArray, 100)
        } catch (error) {
          res.send(error.toString())
        }
      } else {
        for (let i = 0; i < 500; i++) {
          let x = await customLoopingToGetRequiredData(requiredData)
          responseArray.push(x)
        }
      }
      res.send(JSON.stringify({status: 200, data: responseArray}))
    } else {
      throw 'Undefined Data'
    }
  } catch (error) {
    res.send(error.toString())
    return
  }
})

router.post('/uncustomized', async (req, res) => {
  try {
    let requiredData = JSON.parse(req.body.dataMapStructure)
    if (requiredData !== undefined && requiredData !== null) {
      // checking if we have to use db for data
      let dataToGetFromTable = await filteringDataForTable(requiredData)
      let dataToGenerate = await filterDataToGenerate(requiredData)
      // creating response structure
      let responseArray = []
      // checking if table data is represent
      // if not then custom looping will be applied
      if (dataToGetFromTable.length > 0) {
        try {
          await getDataFromTable(dataToGetFromTable, dataToGenerate, responseArray, 100)
        } catch (error) {
          res.send(error.toString())
        }
      } else {
        for (let i = 0; i < 500; i++) {
          let x = await customLoopingToGetRequiredData(requiredData)
          responseArray.push(x)
        }
      }
      res.send(JSON.stringify({status: 200, data: responseArray}))
    } else {
      throw 'Undefined Data'
    }
  } catch (error) {
    res.send(error.toString())
    return
  }
})
// Splitting data for getting query if no data to be taken from table then custom looping will be applied
// For table
async function filteringDataForTable (data) {
  return data.filter(val => {
    return val.tableName !== undefined && val.tableName !== ''
  })
}
// For generator
async function filterDataToGenerate (data) {
  return data.filter(val => {
    return val.haveToGenerateData === true || val.typeOf === 'object'
  })
}

// generating query
async function getQueryFromData (tableData, limit) {
  let columsquery = 'SELECT '
  let tablequery = ' FROM '
  let length = tableData.length
  let keyAndColumnName = []
  for (let i = 0; i < tableData.length; i++) {
   columsquery +=  length - 1 === i ? `${tableData[i].mapTo}` : `${tableData[i].mapTo}, ` 
   keyAndColumnName.push({key: tableData[i].key, columnName: tableData[i].mapTo})
  }
  for (let i = 0; i < length; i++) {
    let indexFound = tableData.findIndex(val => {
      return val.tableName === tableData[i].tableName
    })
    // console.log('IndexFound', indexFound)
    if (indexFound === i && indexFound !== -1) {
      tablequery += i === 0 ? tableData[i].tableName : ` LEFT JOIN ${tableData[i].tableName} ON (${getIdForSpecificTable(tableData[i].tableName)} = ${getIdForSpecificTable(tableData[i - 1].tableName)})`
    }
  }
  let query = columsquery + tablequery + ` LIMIT ${limit}`
  return [query, keyAndColumnName]
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
// getting data from query for array
async function getDataFromTable (tableData, generationData, responseArray, fromChildren) {
  let x = await getQueryFromData(tableData, fromChildren)
  let query = x[0]
  let columnKeyData = x[1]
  console.log('query', query)
  try {
    let response = await pool.query(query)
    if (response.rows.length > 0) {
      for (let i = 0; i < response.rows.length; i++) {
        let responseObj = {}
        for (let j = 0; j < columnKeyData.length; j++) {
          responseObj[columnKeyData[j].key] = response.rows[i][columnKeyData[j].columnName]
        }
        await getData(generationData, responseObj)
        responseArray.push(responseObj)
      }
    }
    return ''
  } catch (error) {
    console.log('error', error)
    return error
  }
}
// getting data from query to object 
// as if var is an object then no need to loop for multiple values
async function getDataFromTableForChildren (tableData, generationData, responseObj) {
  let x = await getQueryFromData(tableData, 1)
  let query = x[0]
  let columnKeyData = x[1]
  // console.log('query', query)
  try {
    let response = await pool.query(query)
    if (response.rows.length > 0) {
      for (let i = 0; i < response.rows.length; i++) {
        for (let j = 0; j < columnKeyData.length; j++) {
          responseObj[columnKeyData[j].key] = response.rows[i][columnKeyData[j].columnName]
        }
        await getData(generationData, responseObj)
      }
    }
    return ''
  } catch (error) {
    console.log('error', error)
    return error
  }
}

// Custom generator
async function customLoopingToGetRequiredData (requiredData) {
  let responseObj = {}
  await getData(requiredData, responseObj)
  return responseObj
}

// after getting data from table now lets generate the remaining data
async function getData (requiredData, responseObj) {
  try {
    for (let rindex = 0; rindex < requiredData.length; rindex++) {
      if (requiredData[rindex].typeOf === 'object') {
        await getDataForParent(requiredData[rindex], responseObj)
      } else if (requiredData[rindex].typeOf !== 'text') {
        await generateCustomData(requiredData[rindex], responseObj)
      } else {
        await getDataFromText(requiredData[rindex], responseObj)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
// 1. Looping in data generation and getting values
// switch case for getting data other then text i.e date, boolean, number, float
async function generateCustomData (data, res) {
  switch (data.typeOf) {
    case 'number' :
     res[data.key] = GenerateData.getNumber(data.min, data.max)
     break
    case 'date':
      res[data.key] = GenerateData.getDate(`${data.fromDate} ${data.fromTime}`, `${data.toDate} ${data.toTime}`)
      break
    case 'bool':
      res[data.key] = GenerateData.getBoolean()
      break
    case 'decimal':
      res[data.key] = GenerateData.getBoolean()
      break
  }
}
// 2. If type is text then checking available genrators for text
// switch case for getting data for text
async function getDataFromText (data, res) {
  switch (data.mapTo) {
    case 'bank_account_number':
      res[data.key] = GenerateData.bankAccountNumber()
      break
    case 'phone_number':
      res[data.key] = GenerateData.phoneNumber()
      break
    default:
      res[data.key] = ''
  }
}
// 3. Getting data for object
async function getDataForParent (data, parent) {
  if (data.isArray === false) {
    let dataToGetFromTable = await filteringDataForTable(data.children)
    let dataToGenerate = await filterDataToGenerate(data.children)
    parent[data.key] = {}
    if (dataToGetFromTable.length > 0) {
      try {
        await getDataFromTableForChildren(dataToGetFromTable, dataToGenerate, parent[data.key])
      } catch (error) {
        res.send(error.toString())
      }
    } else {
      let xy = []
      for (let i = 0; i < 1; i++) {
        let x = await customLoopingToGetRequiredData(data.children)
        xy.push(x)
      }
      parent[data.key] = xy
    }
  } else {
    parent[data.key] = []
    if (data.children[0].typeOf === 'object') {
      let dataToGetFromTable = await filteringDataForTable(data.children[0].children)
      let dataToGenerate = await filterDataToGenerate(data.children[0].children)
      parent[data.key] = []
      if (dataToGetFromTable.length > 0) {
        try {
          await getDataFromTable(dataToGetFromTable, dataToGenerate, parent[data.key], data.haxLengthOfArray)
        } catch (error) {
          res.send(error.toString())
        }
      } else {
        let xy= []
        for (let i = 0; i < data.haxLengthOfArray; i++) {
          let x = await customLoopingToGetRequiredData(data.children[0].children)
          xy.push(x)
        }
        parent[data.key] = xy
      }
    }
    // You can add custom array option here.
    // means that if array dosnt have object it will have simple data type
  }
}
// export module
module.exports = router;