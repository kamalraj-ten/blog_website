const connectDB = require("./DBConnect");

let client = connectDB();
const categories = [
  "Brands",
  "C",
  "C++",
  "Countries",
  "Entertainment",
  "Flutter",
  "Government",
  "Movies",
  "Law",
  "Locations",
  "Lifestyle",
  "Medicine",
  "Memes",
  "Music",
  "Politics",
  "Social services",
  "Sports",
  "Technology",
  "Travel",
  "World News",
];

function toVector(s) {
  var vector = [];
  for (var i = 0; i < s.length; ++i) {
    vector.push(Number(s[i]));
  }
  return vector;
}

const getUserDetail = async (email_id) => {
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );
    var row = result.rows[0];
    return row;
  } catch (e) {
    console.log("catch ", e.stack);
    return null;
  }
};

const getBlogComments = async (blog_id) => {
  let result;
  try {
    result = await client.query(
      "SELECT email_id, comment, date FROM comments WHERE blog_id = $1",
      [blog_id]
    );
  } catch (err) {
    console.log(err.stack);
  }
  return result.rows;
};

const putCommentOnBlog = async (blog_id, email_id, comment) => {
  let result;
  try {
    result = await client.query(
      "INSERT INTO comments(email_id, blog_id, comment, date) VALUES($1,$2,$3,$4)",
      [email_id, blog_id, comment, new Date()]
    );
  } catch (err) {
    console.log(err.stack);
  }
};

const checkUser = async (email_id, password) => {
  let result;
  try {
    let query_res = await client.query(
      "SELECT email_id,username,password FROM users WHERE email_id = $1",
      [email_id]
    );
    if (query_res.rows.length === 0) {
      result = null;
    } else if (
      query_res.rows[0]["password"].toString() === password.toString()
    ) {
      result = query_res.rows[0];
      delete result["password"];
    } else {
      result = null;
    }
  } catch (e) {
    console.log(e.stack);
  }
  return result;
};

const getBlogById = async (blog_id) => {
  try {
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

const getPrivateBlog = async (blog_id, email_id) => {
  try {
    var result = await client.query(
      "SELECT * FROM blogs WHERE blog_id = $1 AND email_id = $2",
      [blog_id, email_id]
    );
    return result.rows[0];
  } catch (e) {
    console.log(e.stack);
    return null;
  }
};

const getBlogByTitle = async (title) => {
  try {
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
  try {
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

const getMyBlogs = async (email_id) => {
  try {
    var result = await client.query("SELECT * FROM blogs WHERE email_id = $1", [
      email_id,
    ]);
    return result.rows;
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
  var resultMsg = { error: "", credentialError: [], success: false };
  try {
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
  try {
    await client.query(
      "INSERT INTO blogs(title, date, visibility, context, categories, email_id, subject) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, new Date(), visibility, content, categories, email_id, subject]
    );

    return true;
  } catch (e) {
    console.log(e);
    return false; // failure
  }
};

const followUser = async (follower, following) => {
  try {
    await client.query("INSERT INTO followers VALUES ($1, $2)", [
      follower,
      following,
    ]);

    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const unfollowUser = async (follower, following) => {
  try {
    await client.query(
      "DELETE FROM followers WHERE follower_email=$1 AND following_email=$2",
      [follower, following]
    );
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getFollowingCount = async (email_id) => {
  try {
    const res = await client.query(
      "SELECT * FROM followers where follower_email = $1",
      [email_id]
    );

    return res.rows.length;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getFollowerCount = async (email_id) => {
  try {
    const res = await client.query(
      "SELECT * FROM followers where following_email = $1",
      [email_id]
    );

    return res.rows.length;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const LikeBlog = async (email_id, blog_id) => {
  try {
    await client.query("INSERT INTO bloglikes VALUES ($1, $2)", [
      email_id,
      blog_id,
    ]);

    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const isLikedBlog = async (email_id, blog_id) => {
  try {
    const res = await client.query(
      "SELECT COUNT(*) as count FROM bloglikes WHERE email_id=$1 AND blog_id=$2",
      [email_id, blog_id]
    );

    return res.rows[0]["count"] > 0;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const removeBlogLike = async (email_id, blog_id) => {
  try {
    const res = await client.query(
      "DELETE FROM bloglikes WHERE email_id=$1 AND blog_id=$2",
      [email_id, blog_id]
    );

    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getBlogLikeCount = async (blog_id) => {
  try {
    const res = await client.query(
      "SELECT COUNT(*) as count FROM bloglikes WHERE blog_id = $1",
      [blog_id]
    );

    return res.rows[0]["count"];
  } catch (e) {
    console.log(e.stack);
    return 0;
  }
};

const addBlogView = async (email_id, blog_id, date = new Date()) => {
  try {
    await client.query("INSERT INTO blogviews VALUES ($1,$2,$3)", [
      email_id,
      blog_id,
      date,
    ]);

    return true;
  } catch (e) {
    //console.log(e.stack);
    console.log("repeating value");
    return false;
  }
};

const getBlogSortedByViews = async () => {
  try {
    const res = await client.query(
      "select blogs.blog_id, visibility, title, subject, count(bloglikes.blog_id) as like_count, count(*) from blogs inner join blogviews on blogviews.blog_id = blogs.blog_id left outer join bloglikes on blogs.blog_id = bloglikes.blog_id group by blogs.blog_id order by count desc, like_count desc"
    );
    return res.rows.filter((blog) => blog["visibility"] == 0);
  } catch (e) {
    console.log(e.stack);
    return [];
  }
};

const getBlogCategories = async () => {
  try {
    const res = await client.query(
      "SELECT blog_id, categories FROM blogs where visibility=0"
    );
    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getUserInterests = async (email_id) => {
  try {
    const res = await client.query(
      "SELECT email_id, interests FROM users WHERE email_id != $1 AND email_id NOT IN (SELECT following_email FROM followers WHERE follower_email = $2)",
      [email_id, email_id]
    );

    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const getBlogCount = async (email_id) => {
  try {
    const res = await client.query(
      "SELECT COUNT(*) as count FROM blogs WHERE email_id = $1",
      [email_id]
    );

    //console.log("count", res.rows);
    return res.rows[0]["count"];
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

const isFollowing = async (email_id, following_email) => {
  try {
    const res = await client.query(
      "SELECT COUNT(*) AS count FROM followers WHERE follower_email = $1 AND following_email = $2",
      [email_id, following_email]
    );

    return res.rows[0]["count"];
  } catch (e) {
    console.log(e.stack);
    return -1;
  }
};

// call it during login and logout
const updateTracking = async (email_id) => {
  try {
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

    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const addTrackingHour = async (email_id, hours) => {
  try {
    // check if the log already present for the day
    const now = new Date();
    const dateCheck = await client.query(
      "SELECT * FROM tracking WHERE email_id = $1 AND date = $2",
      [email_id, now]
    );
    if (dateCheck.rows.length == 1) {
      // log already present
      await client.query(
        "UPDATE tracking SET last_time = $1, hours_used = $2 WHERE email_id = $3 AND date = $4",
        [now, dateCheck.rows[0].hours_used + hours, email_id, now]
      );
    } else {
      // create new log
      await client.query("INSERT INTO tracking VALUES ($1,$2,$3,$4)", [
        email_id,
        now,
        hours,
        now,
      ]);
    }

    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getTracking = async (email_id, days) => {
  try {
    const res = await client.query(
      "SELECT date, hours_used FROM tracking WHERE email_id = $1",
      [email_id]
    );

    var result = res.rows;
    if (res.rows.length > days) {
      result = [];
      for (var i = 0; i < days; ++i) result.push(res.rows[i]);
    }
    return result;
  } catch (e) {
    console.log(e.stack);
    return [];
  }
};

const updateInterestsIncrease = async (email_id, blog_id) => {
  try {
    const { interests } = await getUserDetail(email_id);
    const interestVector = toVector(interests);
    const { categories } = await getBlogById(blog_id);
    const categoriesVector = toVector(categories);
    var finalvector = "";
    for (var i = 0; i < categoriesVector.length; ++i) {
      if (categoriesVector[i] === 1) interestVector[i]++;
      finalvector += interestVector[i];
    }

    await client.query("UPDATE users SET interests=$1 WHERE email_id = $2", [
      finalvector,
      email_id,
    ]);
  } catch (e) {
    console.log(e.stack);
  }
};

const updateInterestsDecrease = async (email_id, blog_id) => {
  try {
    const { interests } = await getUserDetail(email_id);
    const interestVector = toVector(interests);
    const { categories } = await getBlogById(blog_id);
    const categoriesVector = toVector(categories);
    var finalvector = "";
    console.log(interests);
    for (var i = 0; i < categoriesVector.length; ++i) {
      if (categoriesVector[i] === 1) interestVector[i]--;
      finalvector += interestVector[i];
    }
    console.log(finalvector);
    await client.query("UPDATE users SET interests=$1 WHERE email_id = $2", [
      finalvector,
      email_id,
    ]);
  } catch (e) {
    console.log(e.stack);
  }
};

const getLikedUsers = async (email) => {
  try {
    const res = await client.query(
      "(select distinct email_id from blogs where blog_id IN ( select blog_id from bloglikes where email_id = $1) ) except (select distinct following_email from followers where follower_email = $2)",
      [email, email]
    );
    return res.rows;
  } catch (e) {
    console.log(e.stack);
    return [];
  }
};

const searchForUser = async (searchString) => {
  try {
    const userResult = await client.query(
      "select email_id, username from users where username like $1 or email_id like $2",
      ["%" + searchString + "%", "%" + searchString + "%"]
    );
    return userResult.rows;
  } catch (e) {
    console.log(e.stack);
    return [];
  }
};

const searchForBlog = async (searchString) => {
  // search the username and blog title and subject
  // blog search
  try {
    const blogResult = await client.query(
      "select blog_id, title, subject from blogs where visibility = 0 and (title like $1 or subject like $2)",
      ["%" + searchString + "%", "%" + searchString + "%"]
    );
    return blogResult.rows;
  } catch (e) {
    console.log(e.stack);
    return [];
  }
};

const updateBlogByID = async (
  blog_id,
  title,
  subject,
  content,
  visibility,
  categories
) => {
  try {
    const blogResult = await client.query(
      "UPDATE blogs SET title=$1,subject=$2,context=$3,visibility=$4,categories=$5 where blog_id=$6",
      [title, subject, content, visibility, categories, blog_id]
    );
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

const getMultipleBlogLikeCount = async (blog_ids) => {
  try {
    const params = [];
    for (var i = 1; i <= blog_ids.length; ++i) params.push("$" + i);
    const queryString =
      "SELECT blog_id, COUNT(email_id) AS likes FROM bloglikes WHERE blog_id IN (" +
      params.join(",") +
      ") GROUP BY blog_id";
    const res = await client.query(queryString, blog_ids);
    var result = {};
    for (var i = 0; i < res.rows.length; ++i) {
      result[res.rows[i].blog_id] = res.rows[i].likes;
    }
    //console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    var res = {};
    for (id in blog_ids) {
      res[id] = 0;
    }
    return res;
  }
};

const deleteBlog = async (blog_id) => {
  try {
    //deleting referencing rows
    // comments
    await client.query("DELETE FROM comments WHERE blog_id = $1", [blog_id]);
    await client.query("DELETE FROM blogviews WHERE blog_id = $1", [blog_id]);
    await client.query("DELETE FROM bloglikes WHERE blog_id = $1", [blog_id]);
    await client.query("DELETE FROM blogs WHERE blog_id = $1", [blog_id]);
    return true;
  } catch (e) {
    console.log(e.stack);
    return false;
  }
};

module.exports = {
  checkUser,
  getUserDetail,
  getBlogById,
  getBlogByTitle,
  getBlogByEmail,
  signUp,
  getFollowerCount,
  getFollowingCount,
  followUser,
  unfollowUser,
  createBlog,
  LikeBlog,
  isLikedBlog,
  removeBlogLike,
  getBlogLikeCount,
  addBlogView,
  getBlogSortedByViews,
  getBlogCategories,
  getUserInterests,
  getBlogCount,
  isFollowing,
  updateTracking,
  getTracking,
  getBlogComments,
  putCommentOnBlog,
  addTrackingHour,
  updateInterestsIncrease,
  updateInterestsDecrease,
  getLikedUsers,
  searchForBlog,
  searchForUser,
  getMyBlogs,
  getPrivateBlog,
  updateBlogByID,
  getMultipleBlogLikeCount,
  deleteBlog,
  categories,
};
