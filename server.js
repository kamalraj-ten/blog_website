require("dotenv").config();
const express = require("express");
const path = require("path");
const Database = require("./db/database");
const Analytics = require("./db/analytics");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT);

app.use(express.static(path.join(__dirname, "public"))); // servers the index.html
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var hbs = exphbs.create({
  helpers: {
    followButton: (ele) => {
      if (!ele.isFollowing)
      return (
        "<button onclick=\"follow('" +
        ele.email_id +
        '\')" class="btn btn-primary">Follow</button>'
        );
        else return '<span class="badge bg-secondary">following</span>';
      },
    },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
  
  
app.get("/blogHome/:email_id", async (req, res) => {
    let data = {
      username: " ",
      blogsList: [],
      emtBlogsList: true,
      email: req.params.email_id,
      user_suggestions_link: '"/user_suggestions/' + req.params.email_id + '"',
      blog_suggestions_link: '"/blog_suggestions/' + req.params.email_id + '"',
    };
  const tempdat = await Database.getUserDetail(req.params.email_id);
  let blogs = await Database.getBlogByEmail(req.params.email_id);
  if (tempdat != null) {
    data.username = tempdat["username"];
    if (blogs.length != 0) {
      data.emtBlogsList = false;
      data.blogsList = blogs;
    }
    res.render("mainpage", data);
  } else {
    res.end("");
  }
});

app.get("/blog/:id-:email_id-:username", async (req, res) => {
  let trg_email = req.params.email_id;
  let blogData = await Database.getBlogById(req.params.id);
  let render_data = {
    username: req.params.username,
    owner: false,
    email: trg_email,
    blog: blogData,
    emtCommentsList: false,
    commentsList: [],
  };
  if (blogData.email_id === trg_email) {
    render_data.owner = true;
  }
  render_data.commentsList = await Database.getBlogComments(req.params.id);
  if (render_data.commentsList.length === 0) {
    render_data.emtCommentsList = true;
  } else {
    render_data.commentsList.forEach((comment) => {
      comment.date = comment.date.toUTCString().substring(5, 17);
      return comment;
    });
  }
  blogData.date = blogData.date.toUTCString().substring(5, 17);
  res.render("viewBlog", render_data);
});

app.get("/blog_suggestions/:email_id", async (req, res) => {
  const blogSuggestions = await Analytics.blogSuggestion(req.params.email_id);
  var suggestions = [];
  for (var i = 0; i < blogSuggestions.length; ++i) {
    const blog = await Database.getBlogById(blogSuggestions[i].blog_id);
    const user = await Database.getUserDetail(blog.email_id);
    suggestions.push({
      title: blog.title,
      subject: blog.subject,
      link:
        "/blog/" +
        blog.blog_id +
        "-" +
        req.params.email_id +
        "-" +
        user.username,
      action: "Open",
    });
  }
  res.render("suggestion_page", {
    suggestion_title: "Blog suggestions",
    suggestions,
  });
});

app.get("/user_suggestions/:email_id", async (req, res) => {
  const userSuggestions = await Analytics.userSuggestion(req.params.email_id);
  var suggestions = [];
  for (var i = 0; i < userSuggestions.length; ++i) {
    const user = await Database.getUserDetail(userSuggestions[i].email_id);
    suggestions.push({
      title: user.username,
      subject: user.email_id,
      link: "/user/" + user.email_id + "-" + req.params.email_id,
      action: "See",
    });
  }
  res.render("suggestion_page", {
    suggestion_title: "User suggestions",
    suggestions,
  });
});

// pages
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);
app.get("/sign_up", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "signup2.html"))
);
app.get("/home", (req, res) => res.send("home page"));

app.get("/user/:id-:email_id", async (req, res) => {
  // email_id is the current user email_id
  const user = await Database.getUserDetail(req.params.id);
  const follower = await Database.getFollowerCount(req.params.id);
  const following = await Database.getFollowingCount(req.params.id);
  const blog_count = await Database.getBlogCount(req.params.id);
  const isFollowing =
    (await Database.isFollowing(req.params.email_id, req.params.id)) == 1;
  const userBlogs = await Database.getBlogByEmail(req.params.id);
  const chart_load_function = 'loadChart("' + req.params.id + '")';
  const blogs = [];
  for (var i = 0; i < userBlogs.length; ++i) {
    blogs.push({
      title: userBlogs[i].title,
      subject: userBlogs[i].subject,
      link: "/blog/" + userBlogs[i].blog_id,
      action: "Open",
    });
  }
  res.render("userpage", {
    username: user.username,
    name: user.name,
    email_id: user.email_id,
    following,
    follower,
    isFollowing,
    blog_count,
    blogs,
    chart_load_function,
    user_email: req.params.email_id,
  });
});

//Database API routes
app.use('/database',require(path.join(__dirname,'routes','databaseAPI')))

//Tracking API routes
app.use('/tracking',require(path.join(__dirname,'routes','trackingAPI')))

// follow api
app.post("/follow_user", async (req, res) => {
  const { follower, following } = req.body;
  try {
    await Database.followUser(follower, following);
    res.json({ validity: true });
  } catch (e) {
    console.log(e.stack);
    res.json({ validity: false });
  }
});

//Database.getTime();
// Analytics.userSuggestion("kamal@123").then((suggestedBlogs) =>
//   console.log(suggestedBlogs)
// );

//blog related api
// app.get("/blog/get_blog_by_id", async (req, res) => {
//   const blog = await Database.getBlogById(req.body["blog_id"]);
//   res.send(blog);
// });
// app.get("/blog/get_blog_by_title", async (req, res) => {
//   const blogs = await Database.getBlogByTitle(req.body["title"]);
//   res.send(blogs);
// });
// app.get("/blog/get_blog_by_email", async (req, res) => {
//   const blogs = await Database.getBlogByEmail(req.body["email_id"]);
//   res.send(blogs);
// });