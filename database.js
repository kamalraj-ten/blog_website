var pg = require("pg");
//or native libpq bindings
//var pg = require('pg').native

var conString = process.env.DB_URI; //Can be found in the Details page

const getTime = () => {
  var client = new pg.Client(conString);
  client.connect(function (err) {
    if (err) {
      return console.error("could not connect to postgres", err);
    }
    client.query('SELECT NOW() AS "theTime"', function (err, result) {
      if (err) {
        return console.error("error running query", err);
      }
      console.log(result.rows[0].theTime);
      // >> output: 2018-08-23T14:02:57.117Z
      client.end();
    });
  });
};

const getUserDetail = async (email_id) => {
  var client = new pg.Client(conString);

  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );
    //console.log(result);
    var row = result.rows[0];
    delete row["password"];
    return row;
  } catch (e) {
    console.log(e.stack);
    return null;
  }
};

const checkUser = async (email_id, password) => {
  var client = new pg.Client(conString);
  var validity = false;

  try {
    await client.connect();
    const result = await client.query(
      "SELECT email_id, password FROM users WHERE email_id = $1",
      [email_id]
    );
    //console.log("result ", result);
    if (result.rows[0]["password"].toString() === password.toString())
      validity = true;
    //console.log(result.rows[0]["password"], password);
  } catch (e) {
    console.log(e.stack);
  }
  client.end();
  return validity;
};

module.exports = { getTime, checkUser, getUserDetail };
