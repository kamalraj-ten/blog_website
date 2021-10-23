var pg = require("pg");

const connectDB= ()=>{
  let client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
  })
  client.connect()
  return client
}

module.exports = connectDB