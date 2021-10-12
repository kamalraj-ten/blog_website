var pg = require("pg");

//var conString = process.env.DB_URI; //Can be found in the Details page
var conString = process.env.DATABASE_URL;

const getTime = () => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
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
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );
    var row = result.rows[0];
    return row;
  } catch (e) {
    console.log("catch ",e.stack);
    return null;
  }
};

const getBlogComments = async (blog_id)=> {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  let result;
  try {
    await client.connect();
    result = await client.query("SELECT email_id, comment FROM comments WHERE blog_id = $1",[blog_id]);
  } catch (err) {
    console.log(err.stack);
  }
  client.end();
  return result.rows;
}

const putCommentOnBlog = async (blog_id,email_id,comment)=>{
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  let result;
  try {
    await client.connect();
    result = await client.query("INSERT INTO comments VALUES($1,$2,$3,$4)", [
      email_id,
      blog_id,
      comment,
      new Date()
    ]);
  } catch (err) {
    console.log(err.stack);
  }
  client.end();
}

const checkUser = async (email_id, password) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

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

const getBlogById = async (blog_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    var result = await client.query("SELECT * FROM blogs WHERE blog_id = $1", [
      blog_id,
    ]);
    if (result.rows[0]["visibility"] === 0) return result.rows[0];
    return null;
  } catch (e) {
    console.log(e.stack);
    return null;
  }
};

const getBlogByTitle = async (title) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    var result = await client.query("SELECT * FROM blogs WHERE title LIKE $1", [
      "%" + title + "%",
    ]);
    const visibleBlogs = result.rows.filter((blog) => blog["visibility"] == 0);
    return visibleBlogs;
  } catch (e) {
    console.log(e.stack);
    return null;
  }
};

const getBlogByEmail = async (email_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    var result = await client.query("SELECT * FROM blogs WHERE email_id = $1", [
      email_id,
    ]);
    const visibleBlogs = result.rows.filter((blog) => blog["visibility"] == 0);
    return visibleBlogs;
  } catch (e) {
    console.log(e.stack);
    return null;
  }
};

const signUp = async (
  email_id,
  username,
  name,
  dob,
  gender,
  country,
  interests,
  password
) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  var resultMsg = { error: "", credentialError: [], success: false };
  try {
    client.connect();
    var errorHappened = false;
    // check email
    const emailCheck = await client.query(
      "SELECT count(*) as count FROM users WHERE email_id = $1",
      [email_id]
    );
    if (Number(emailCheck.rows[0]["count"]) > 0) {
      resultMsg["credentialError"].push("Email id already exists");
      errorHappened = true;
    }

    // check username
    const usernameCheck = await client.query(
      "SELECT count(*) as count FROM users WHERE username = $1",
      [username]
    );
    if (Number(usernameCheck.rows[0]["count"]) > 0) {
      resultMsg["credentialError"].push("Username already exists");
      errorHappened = true;
    }

    // inserting into table if no error happened
    if (!errorHappened) {
      await client.query("INSERT INTO users VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [
        email_id,
        username,
        name,
        dob,
        gender,
        country,
        interests,
        password,
      ]);
      resultMsg["success"] = true;
    }
  } catch (e) {
    console.log(e.stack);
    resultMsg["error"] = "error signin up. Try after some time."; // says about error or email_id exists
  }

  return resultMsg;
};

const createBlog = async (
  title,
  visibility,
  content,
  categories,
  email_id,
  subject
) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query(
      "INSERT INTO blogs(title, date, visibility, context, categories, email_id, subject) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, new Date(), visibility, content, categories, email_id, subject]
    );
    client.end();
    return true;
  } catch (e) {
    console.log(e.stack);
    return false; // failure
  }
};

const followUser = async (follower, following) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query("INSERT INTO followers VALUES ($1, $2)", [
      follower,
      following,
    ]);
    client.close();
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getFollowingCount = async (email_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT * FROM followers where follower_email = $1",
      [email_id]
    );
    client.end();
    return res.rows.length;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getFollowerCount = async (email_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT * FROM followers where following_email = $1",
      [email_id]
    );
    client.end();
    return res.rows.length;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const LikeBlog = async (email_id, blog_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query("INSERT INTO bloglikes VALUES ($1, $2)", [
      email_id,
      blog_id,
    ]);
    client.end();
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getBlogLikeCount = async (blog_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT COUNT(*) as count FROM bloglikes WHERE blog_id = $1",
      [blog_id]
    );
    client.end();
    return res.rows["count"];
  } catch (e) {
    console.log(e.stack);
    return 0;
  }
};

const addBlogView = async (email_id, blog_id, date = new Date()) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    await client.query("INSERT INTO blogviews VALUES ($1,$2,$3)", [
      email_id,
      blog_id,
      date,
    ]);
    client.end();
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getBlogCategories = async () => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query("SELECT blog_id, categories FROM blogs");
    client.end();
    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getUserInterests = async () => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query("SELECT email_id, interests FROM users");
    client.end();
    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getBlogCount = async (email_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT COUNT(*) as count FROM blogs WHERE email_id = $1",
      [email_id]
    );
    client.end();
    //console.log("count", res.rows);
    return res.rows[0]["count"];
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const isFollowing = async (email_id, following_email) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT COUNT(*) AS count FROM followers WHERE follower_email = $1 AND following_email = $2",
      [email_id, following_email]
    );
    client.end();
    return res.rows[0]["count"];
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

// call it during login and logout
const updateTracking = async (email_id) => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    // check if the log already present for the day
    const now = new Date();
    const dateCheck = await client.query(
      "SELECT * FROM tracking WHERE email_id = $1 AND date = $2",
      [email_id, now]
    );
    if (dateCheck.rows.length == 1) {
      // log already present
      const milliseconds = now - dateCheck.rows[0].last_time;
      const hours = milliseconds / 36e5 + dateCheck.rows[0].hours_used;
      await client.query(
        "UPDATE tracking SET last_time = $1, hours_used = $2 WHERE email_id = $3 AND date = $4",
        [now, hours, email_id, now]
      );
    } else {
      // create new log
      await client.query("INSERT INTO tracking VALUES ($1,$2,$3,$4)", [
        email_id,
        now,
        0,
        now,
      ]);
    }
    client.end();
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const general = async () => {
  var client = new pg.Client({
    connectionString: conString,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    client.end();
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

module.exports = {
  getTime,
  checkUser,
  getUserDetail,
  getBlogById,
  getBlogByTitle,
  getBlogByEmail,
  signUp,
  getFollowerCount,
  getFollowingCount,
  followUser,
  createBlog,
  LikeBlog,
  getBlogLikeCount,
  addBlogView,
  getBlogCategories,
  getUserInterests,
  getBlogCount,
  isFollowing,
  updateTracking,
  getBlogComments,
  putCommentOnBlog,
};
