import config from '../../config';
const { Pool, Client } = require('pg')

const { POSTGRES_URI } = config;

const db = `${POSTGRES_URI}`;
const pool = new Pool({
  connectionString: db,
});

// Sending client connect
async function connectToDatabase () {
  const client = await pool.connect();
  return client;
};

module.exports = connectToDatabase;