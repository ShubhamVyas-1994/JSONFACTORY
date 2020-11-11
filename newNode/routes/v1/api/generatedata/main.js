let router = require('express').Router();
var pool = require('../../../../db');

import GenerateData from './generate'

router.post('/data', async (req, res) => {
  try {
    // parsing incoming data structure
    let requestData = JSON.parse(req.body.dataMapStructure)
    // static limit for now //later will be changed as per login
    let limit = 1

    if (requestData !== null) {
      // filtering data which to extract from db
      let dataFromTable = await fiterDataToBeGeneratedByTable(requestData)
      // custom genration data
      let customDataGenerator = await fiterDataToBeGenerated(requestData)
      // chcking if we have to extract any ddata from db
      // if yes then first getting that data
      if (dataFromTable.length > 0) {
        // function returns query at first and key and column name map at second
        const keyAndQuery = await generateQueryFromData(dataFromTable)
        try {
          // getting data from db
          let data = await pool.query(keyAndQuery[0] + ` ORDER BY random() LIMIT ${limit}`)
          // releasing pool
          // if we didnt reach limit then calling for data second time
          if (data.rows.length < limit) {
            try {
              let subData = await pool.query(keyAndQuery[0] + ` ORDER BY random() LIMIT ${limit - data.rows.length}`)
              // adding data to earlier extracted data using spread operator
              if (subData.rows.length > 0) {
                data.rows = [...data.rows, ...subData.rows]
              }
            } catch (error) {
              console.log('2', error)
              throw error
            } finally {
              pool.release
            }
          }
          // Response data to send
          let responseData = []
          // now lets change keys of object as entered by user
          for (let dummyIndex = 0; dummyIndex < data.rows.length; dummyIndex++) {
            try {
              let x = await mapTableDataWithCustomKeys(data.rows[dummyIndex], keyAndQuery[1])
              responseData.push(x)
            } catch (error) {
              throw error
            }
          }
          // now once db data is extracted its time to generate custom data
          try {
            await generateCustomDataHavingTableData(customDataGenerator, responseData)
            // Its time to send response
            res.send({status: 200, data: responseData})
            return
          } catch (error) {
            throw error
          }
        } catch (queryError) {
          console.log('1')
          console.error(queryError)
          throw queryError
        } finally {
          pool.release
        }

      } else {
        // here we had no data to be extracted from db so now we generate the required data
        let responseData = []
        // consider static length for now later we can add length depeding on login
        for (i in 500) {
          // this obj will ensure of getting required data on keys added by user
          let obj = {}
          try {
            await generateCustomData(customDataGenerator, obj)
            responseData.push(obj)
          } catch (error) {
            throw error
          }
        }
        res.send(JSON.stringify({status: 200, data: responseData}))
        return
      }
    } else {
      throw 'Invalid data'
    }
  } catch (error) {
    res.send(error.toString())
    return
  }
})

// map table data with customkeys
async function mapTableDataWithCustomKeys (tableData, parent, objToReturn) {
  let x = {}
  for (let pindex = 0; pindex < parent.length; pindex++) {
    x[parent[pindex].key] = tableData[parent[pindex].columnName]
  }
  // console.log(x, 'x')
  return x
}
// function to filter table generation data
async function fiterDataToBeGeneratedByTable (requestData) {
  return requestData.filter(value => {
    return value.tableName !== '' && value.tableName !== undefined
  })
}

// function to filter custom generation data
async function fiterDataToBeGenerated (requestData) {
  return requestData.filter(value => {
    return value.haveToGenerateData === true || value.typeOf === 'object'
  })
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

// Generating query
async function generateQueryFromData (data) {
  let columsquery = 'SELECT '
  let tablequery = ' FROM '
  // track of data keys from table
  let keyAndColumnName = []
  let length = data.length

  for (let i = 0; i < data.length; i++) {
    columsquery +=  length - 1 === i ? `${data[i].mapTo}` : `${data[i].mapTo}, ` 
    keyAndColumnName.push({key: data[i].key, columnName: data[i].mapTo})
   }
   for (let i = 0; i < length; i++) {
     let indexFound = data.findIndex(val => {
       return val.tableName === data[i].tableName
     })
     // console.log('IndexFound', indexFound)
     if (indexFound === i && indexFound !== -1) {
       tablequery += i === 0 ? data[i].tableName : ` LEFT JOIN ${data[i].tableName} ON (${getIdForSpecificTable(data[i].tableName)} = ${getIdForSpecificTable(data[i - 1].tableName)})`
     }
   }
   let query = columsquery + tablequery
   return [query, keyAndColumnName]
}
// generating custom data but after getting required table data
async function generateCustomDataHavingTableData (requestData, parentData) {
  for (let parent of parentData) {
    if (parent === undefined) return
    try {
      await generateCustomData(requestData, parent)
    } catch (error) {
      console.log('3')
      throw error
    }
  }
  // for (let i = 0; i < parentData.length; i++) {
  // }
}

async function generateCustomData (requestData, parent) {
  // console.log(requestData)
  if (parent === undefined || requestData === undefined) return
  for (let requestItem of requestData) {
    // console.log(requestItem.typeOf)
    if (requestItem.typeOf === 'text') {
      await getDataFromText(requestItem, parent)
    } else if (requestItem.typeOf !== 'object') {
      await generateCustomDataForOtherType(requestItem, parent)
    } else if (requestItem.typeOf === 'object') {
      try {
        await generateDataForObject(requestItem, parent)
      } catch (error) {
        console.error('Error here')
        throw error
      }
    }
  }
}

// some data which don't require table can be generated here
async function getDataFromText (data, res) {
  switch (data.mapTo) {
    case 'bank_account_number':
      res[data.key] = GenerateData.bankAccountNumber()
      break
    case 'phone_number':
      res[data.key] = GenerateData.phoneNumber()
      break
    case 'custom':
      res[data.key] = data.getDataFrom !== undefined ? data.getDataFrom[GenerateData.getNumber(0, data.getDataFrom.length - 1)] : ''
      break
    case 'unique_code':
      res[data.key] = GenerateData.uniqueCode()
      break
    default:
      res[data.key] = ''
  }
}
// generation of data other then text i.e like boolean, number, decimal etc
async function generateCustomDataForOtherType (data, res) {
  switch (data.typeOf) {
    case 'number' :
     res[data.key] = data.mapTo === 'unique_id' ? GenerateData.uniqueId() : GenerateData.getNumber(data.min, data.max)
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
    default:
      res[data.key] = ''
      break
  }
}

// in case its an object

async function generateDataForObject (requestData, parent, limit) {
  // if (parent.length === undefined)
  try {
    if (requestData.isArray === false) {
      let dataFromTable = await fiterDataToBeGeneratedByTable(requestData.children)
      let customDataGenerator = await fiterDataToBeGenerated(requestData.children)
      parent[requestData.key] = {}
      if (dataFromTable === undefined) return
      if (dataFromTable.length > 0) {
        let keyAndQuery = await generateQueryFromData(dataFromTable)
        try {
          let data = await pool.query(keyAndQuery[0] + ` ORDER BY random() LIMIT 1`)
          // console.log(keyAndQuery[0])
          // releasing pool
          pool.release
  
          for (let pindex = 0; pindex < keyAndQuery[1].length; pindex++) {
            parent[requestData.key][keyAndQuery[pindex].key] = data[0][keyAndQuery[pindex].columnName]
          }
  
          try {
            await generateCustomData(customDataGenerator, parent[requestData.key])
          } catch (error) {
            console.log('12')
            throw error
          }
  
        } catch (queryError) {
          console.log('11')
          throw queryError
        }
      } else {}
    } else {
      parent[requestData.key] = []
      if (requestData.children.length === 0) return

      if (requestData.children[0].typeOf === 'object') {
        let dataFromTable = await fiterDataToBeGeneratedByTable(requestData.children[0].children)
        let customDataGenerator = await fiterDataToBeGenerated(requestData.children[0].children)
        // console.log('dataFromTable', dataFromTable)
        if (dataFromTable === undefined) return
        if (dataFromTable.length > 0) {
          
          let keyAndQuery = await generateQueryFromData(dataFromTable)
  
          try {
            let data = await pool.query(keyAndQuery[0] + ` ORDER BY random() LIMIT ${requestData.haxLengthOfArray}`)
            // releasing pool
            if (data.rows.length < limit) {
              try {
                let subData = await pool.query(keyAndQuery[0] + ` ORDER BY random() LIMIT ${limit - data.rows.length}`)
                data.rows = [...data.rows, ...subData.rows]
              } catch (error) {
                console.log('6')
                throw error
              } finally {
                pool.release
              }
            }
            for (let dummyIndex = 0; dummyIndex < data.rows.length; dummyIndex++) {
              try {
                let x = await mapTableDataWithCustomKeys(data.rows[dummyIndex], keyAndQuery[1])
                parent[requestData.key].push(x)
              } catch (error) {
                console.log('Error in here', error)
                throw error
              }
            }
            // console.log('Parrent is an array', customDataGenerator)
            try {
              await generateCustomDataHavingTableData(customDataGenerator, parent[requestData.key])
            } catch (error) {
              console.log('14')
              throw error
            }
          } catch (queryError) {
            console.log('16')
            throw queryError
          } finally {
            pool.release
          }
        } else {
          for (i in parseInt(requestData.haxLengthOfArray)) {
            let obj = {}
            try {
              await generateCustomData(customDataGenerator, obj)
              parent[requestData.key].push(obj)
            } catch (error) {
              console.log('19')
              throw error
            }
          }
        }
      }
      // You can add custom array option here.
      // means that if array dosnt have object it will have simple data type
    }
  } catch (error)  {
    throw error
  }
}
// export module
module.exports = router;
