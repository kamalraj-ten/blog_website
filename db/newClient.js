var pg = require("pg");

var conString = process.env.DATABASE_URL;

const newClient = ()=>{
    return new pg.Client({
        connectionString: conString,
        ssl: {
          rejectUnauthorized: false,
        },
    });
}

module.exports = newClient;