// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // Required for AWS RDS SSL connections
//   },
// });

// module.exports = pool;
// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: false, // Disable SSL for local development
// });

// module.exports = pool;

const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Required for production (AWS, Vercel, etc.)
    : false, // No SSL for local development
});
console.log("which database", process.env.DATABASE_URL);

module.exports = pool;
