const express = require("express");
const Database = require("../db/database");
const router = express.Router();
const auth = require("../db/auth");
const categories = Database.categories;

router.post("/sign_in/", async (req, res) => {
  const user = await Database.checkUser(
    req.body["email_id"],
    req.body["password"],
    (time = new Date())
  );
  if (user === null) {
    res.render("login", { layout: "no_nav_main", Invalid: "true" });
  } else {
    let token = auth.createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 36 * Math.pow(10, 5),
    });
    res.redirect("/blogHome");
  }
});

router.post("/sign_up/", async (req, res) => {
  // dob - javascript Date object
  // interests - array of interests
  // gender - M, F, T
  const {
    email_id,
    username,
    name,
    dob,
    gender,
    country,
    interests,
    password,
  } = req.body;
  var interestVector = "";
  //changing interests to vector of 0 and 1
  interests.sort();
  var i = 0;
  var j = 0;
  for (; i < categories.length; ++i) {
    if (categories[i] === interests[j]) {
      interestVector += 1;
      ++j;
    } else interestVector += 0;
  }
  const response = await Database.signUp(
    email_id,
    username,
    name,
    dob,
    gender,
    country,
    interestVector,
    password
  );
  res.send(response);
});

router.get("/user_search/:text/", async (req, res) => {
  const result = await Database.searchForUser(req.params.text);
  //console.log("result", result);
  res.json({ data: result });
});

router.get("/blog_search/:text/", async (req, res) => {
  const result = await Database.searchForBlog(req.params.text);
  //console.log("blog", result);
  res.json({ data: result });
});

router.get("/", (req, res) => {
  console.log("came in");
  res.end();
});

module.exports = router;
