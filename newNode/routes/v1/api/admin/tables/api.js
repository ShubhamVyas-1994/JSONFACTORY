let router = require('express').Router();
var pool = require('../../../../../db');

router.get('/list', async (req, res) => {
    try {
      const data = await pool.query(`SELECT mapping_id, name, cat_id, map_to, table_name, is_table_present, is_active from mapping_table_list LEFT JOIN subcategory_details ON subcat_id = cat_id`);
      pool.release
      let responseData = []
      for (let i = 0; i < data.rows.length; i++) {
        responseData.push({
          mappingId: data.rows[i].mapping_id,
          categoryId: data.rows[i].cat_id,
          name: data.rows[i].name,
          mapTo: data.rows[i].map_to,
          tableName: data.rows[i].table_name,
          isTablePresent: data.rows[i].is_table_present,
          isActive: data.rows[i].is_active
        })
      }
      res.send(JSON.stringify({status: 200, data: responseData}))
      return
    } catch (err) {
      pool.release
      res.send(JSON.stringify({status: 201, data: null, message: err.toString()}))
      return
    }
})

router.post('/add', async (req, res) => {
  try {
    let details = JSON.parse(req.body.mappingDetails)
    let query;
    if (details.mappingId > 0) {
      query = `UPDATE mapping_table_list SET name = '${details.name}', cat_id = ${details.categoryId}, is_active = ${details.isActive} WHERE mapping_id = ${details.mappingId}`
    } else {
      query = `INSERT INTO mapping_table_list(name, cat_id, is_active) VALUES ('${details.name}', ${details.categoryId}, ${details.isActive})`
    }
    try {
      let data = await pool.query(query)
      pool.release
      res.send(JSON.stringify({status: 200, data: data, message: 'Data added succesfully'}))
      return
    } catch (error) {
      pool.release
      res.send(JSON.stringify({status: 201, data: null, message: error.toString()}))
      return
    }
  } catch (error) {
    res.send(JSON.stringify({status: 201, data: null, message: error.toString()}))
    return
  }
})
// export module
module.exports = router;