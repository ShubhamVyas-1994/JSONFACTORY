import config from './config';
const { Pool, Client } = require('pg')

const { POSTGRES_URI } = config;

const db = `${POSTGRES_URI}`;

var client;
// Sending client connect
function connectToDatabase () {
  const pool = new Pool({
    connectionString: db,
  })
  try {
    pool.connect()
    return pool;
  } catch (error) {
    console.log(error)
  }
};

module.exports = connectToDatabase();