// database connection
// grabbed from a .env to keep variables safe

require('dotenv').config()
const pg = require('pg')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // i do not have a valid ssl certificate
  },
})

module.exports = pool