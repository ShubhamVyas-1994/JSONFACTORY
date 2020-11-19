import pool from '../db/db';
const uuidv4 = require("uuid/v4");

export async function getUserDetailsFromToken(authToken) {
  let client = await pool();
  try {
    let res = client.query(`SELECT jf_user_id FROM jf_user_auth_details WHERE authtoken = '${authToken}'`);
    return res.rows[0]
  } catch (error) {
    throw error
  } finally {
    client.release(true);
  }
};

export async function generateAuthToken(userId) {
  let token = uuidv4();
  let client = await pool();
  try {
    _ = await client.query(`INSERT INTO jf_user_auth_details(authtoken, jf_user_id, logged_in) VALUES ('${token}', ${userId}, '${new Date().toISOString()}')`)
  } catch (error) {
    throw error
  } finally {
    client.release(true)
  }
  return token;
}