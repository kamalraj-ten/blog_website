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
  if (response["success"])
    res.cookie("createUser", true, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  res.redirect("/login");
});

router.post("/blog", async (req, res) => {
  let user = auth.verifyToken(req.cookies.token);
  if (user === null) {
    res.clearCookie("token");
    res.redirect("/login");
  }
  let data = JSON.parse(JSON.stringify(req.body));
  let blog = {
    email_id: user.email_id,
    title: data["blogTitle"],
    subject: data["blogSubject"],
    content: data["blogContent"],
    visibility: 1,
    categoryVector: "",
  };
  if (data["visibility"] == "public") {
    blog.visibility = 0;
  }
  if (data["category"] == null) {
    return res.render("create_blog", {
      blogTitle: blog.title,
      blogContent: blog.content,
      blogSubject: blog.subject,
      categories,
      message: "Please select atleast one category",
      alertBorder: "border border-danger border-2",
    });
  } else {
    if (typeof data["category"] == "string") {
      data["category"] = [data["category"]];
    }
    data["category"] = data["category"].sort();
    categories.sort();
    var i = 0;
    var j = 0;
    for (; i < categories.length; ++i) {
      if (categories[i] === data["category"][j]) {
        blog.categoryVector += 1;
        //console.log(data["category"][j],categories[i], blog.categoryVector, i , j)
        j = j + 1;
      } else blog.categoryVector += 0;
      //console.log(data["category"][j-1],categories[i], blog.categoryVector, i , j-1)
    }
  }
  let flag = await Database.createBlog(
    blog.title,
    blog.visibility,
    blog.content,
    blog.categoryVector,
    blog.email_id,
    blog.subject
  );
  //res.send(JSON.stringify(flag));
  if (flag == true) {
    //alert user that blog is created (use modal to show message), then redirect to main page
    res.cookie("createdBlog", true, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  } else {
    //alert user that blog is not created (use modal to show message), then redirect to main page
    res.cookie("errorCreatingBlog", false, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }
  res.redirect("/blogHome");
});

router.post("/blog_edit/:id", async (req, res) => {
  let user = auth.verifyToken(req.cookies.token);
  if (user === null) {
    res.clearCookie("token");
    res.redirect("/login");
  }
  let data = JSON.parse(JSON.stringify(req.body));
  let visibility_private = "checked",
    visibility_public;
  let blog = {
    email_id: user.email_id,
    title: data["blogTitle"],
    subject: data["blogSubject"],
    content: data["blogContent"],
    visibility: 1,
    categoryVector: "",
  };
  if (data["visibility"] == "public") {
    blog.visibility = 0;
    visibility_private = null;
    visibility_public = "checked";
  }
  if (data["category"] == null) {
    let blogCategory = [];
    for (let i = 0; i < categories.length; i++) {
      blogCategory.push({
        category: categories[i],
        style: "btn btn-outline-success",
      });
    }
    return res.render("editBlog", {
      blogTitle: blog.title,
      blogContent: blog.content,
      blogSubject: blog.subject,
      blogCategory,
      visibility_public,
      visibility_private,
      blog_id: req.params.id,
      message: "Please select atleast one category",
      alertBorder: "border border-danger border-2",
    });
  } else {
    if (typeof data["category"] == "string") {
      data["category"] = [data["category"]];
    }
    data["category"].sort();
    categories.sort();
    var j = 0;
    for (var i = 0; i < categories.length; ++i) {
      if (categories[i] === data["category"][j]) {
        blog.categoryVector += 1;
        ++j;
      } else blog.categoryVector += 0;
    }
  }
  let flag = await Database.updateBlogByID(
    req.params.id,
    blog.title,
    blog.subject,
    blog.content,
    blog.visibility,
    blog.categoryVector
  );
  //res.send(JSON.stringify(flag));
  if (flag == true) {
    //alert user that blog is created (use modal to show message), then redirect to main page
    res.cookie("editedBlog", true, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  } else {
    //alert user that blog is not created (use modal to show message), then redirect to main page
    res.cookie("errorEditingBlog", false, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }
  res.redirect("/blogHome");
});

router.get("/user_search/:text/", async (req, res) => {
  const result = await Database.searchForUser(req.params.text);
  res.json({ data: result });
});

router.get("/blog_search/:text/", async (req, res) => {
  const result = await Database.searchForBlog(req.params.text);
  res.json({ data: result });
});

router.get("/", (req, res) => {
  console.log("came in");
  res.end();
});

module.exports = router;
