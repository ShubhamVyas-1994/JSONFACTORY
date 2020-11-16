let router = require('express').Router();
var pool = require('../../../db/db');

router.get('/list', async (req, res) => {
    try {
      const data = await pool.query(`SELECT subcat_id, subcat_name, subcat_title, map_to, subcategory_details.category_id, category_name, is_table_present, table_name from subcategory_details LEFT JOIN category_details ON (subcategory_details.category_id = category_details.category_id)`);
      pool.release
      let dataToSend = []
      for (let i = 0; i < data.rows.length; i++) {
        dataToSend.push({
          categoryMasterId: data.rows[i].subcat_id,
          categoryName: data.rows[i].subcat_name,
          categoryTitle: data.rows[i].subcat_title,
          mapTo: data.rows[i].map_to,
          parentId: data.rows[i].category_id,
          parentCategoryName: data.rows[i].category_name,
          isTablePresent: data.rows[i].is_table_present,
          valueFromTable: data.rows[i].table_name
        })
      }
      res.send(JSON.stringify({status: 200, data: dataToSend}))
    } catch (err) {
      console.error(err)
    }
})

router.get('/parent/list', async (req, res) => {
  try {
    const data = await pool.query(`SELECT category_id, category_name from category_details`);
    pool.release
    let dataToSend = []
    for (let i = 0; i < data.rows.length; i++) {
      dataToSend.push({
        parentId: data.rows[i].category_id,
        parentCategoryName: data.rows[i].category_name
      })
    }
    res.send(JSON.stringify(dataToSend))
  } catch (err) {
    console.error(err)
  }
})

router.post('/add', async (req, res) => {
  try {
    let details = JSON.parse(req.body.categoryDetails)
    let query;
    if (details.categoryMasterId === 0) {
      if (await checkForCategoryNameExistance(details.categoryName)) {
        query = `INSERT INTO subcategory_details(subcat_name, subcat_title, map_to, category_id, is_table_present, table_name) VALUES ('${details.categoryName}', '${details.cartegoryName}', '${details.mapTo}', ${details.parentId}, ${details.isTablePresent}, '${details.valueFromTable}')`
        // if (details.parentId > 0) {
        // } else {
        //   query = `INSERT INTO category_details(category_name) VALUES ('${details.categoryName}')`
        // }
      } else {
        res.send('Category does exist')
        return
      }
    } else {
      query = `UPDATE subcategory_details SET subcat_name = '${details.categoryName}', subcat_title = '${details.cartegoryName}', map_to = '${details.mapTo}', category_id = ${details.parentId}, is_table_present = ${details.isTablePresent}, table_name = '${details.valueFromTable}' WHERE subcat_id = ${details.categoryMasterId}`
    }
    try {
      console.log(query)
      await pool.query(query)
      pool.release
      res.send(JSON.stringify({message: 'Successfully added category details'}))
    } catch (error) {
      pool.release
      res.send(error.toString())
      return
    }
  } catch (error) {
    res.send(error)
    return
  }
})

async function checkForCategoryNameExistance (categoryName) {
  let results = await pool.query(`SELECT count(subcat_id) FROM subcategory_details WHERE LOWER(subcat_name) = LOWER('${categoryName}')`)
  pool.release
  console.log(results.rows[0].count)
  return parseInt(results.rows[0].count) === 0
}

// export module
module.exports = router;
