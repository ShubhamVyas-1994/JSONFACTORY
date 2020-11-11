import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  POSTGRES_URI: process.env.POSTGRES_URI,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
};