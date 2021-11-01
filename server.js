require("dotenv").config();
const express = require("express");
const path = require("path");
const Database = require("./db/database");
const Analytics = require("./db/analytics");
const exphbs = require("express-handlebars");
const auth = require("./db/auth");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT);

app.use(express.static(path.join(__dirname, "public"))); // servers the index.html
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//express handlebars - helper functions
var hbs = exphbs.create({
  helpers: {
    followButton: (ele) => {
      if (!ele.isFollowing)
        return (
          "<button onclick=\"follow('" +
          ele.user_email +
          " ," +
          ele.trg_email_id +
          '\')" class="btn btn-primary">Follow</button>'
        );
      else return '<span class="badge bg-secondary">following</span>';
    },
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.get("/blog/:id/", async (req, res) => {
  const user = auth.verifyToken(req.cookies.token);
  if (user === null) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
  let trg_email = user.email_id;
  let blogData = await Database.getBlogById(req.params.id);
  let render_data = {
    username: user.username,
    owner: false,
    email: trg_email,
    blog: blogData,
    emtCommentsList: false,
    commentsList: [],
    liked: false,
    like_count: 0,
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

  //like data
  render_data.like_count = await Database.getBlogLikeCount(req.params.id);
  render_data.liked = await Database.isLikedBlog(trg_email, req.params.id);

  // updating view count of blog
  await Database.addBlogView(trg_email, req.params.id);

  res.render("viewBlog", render_data);
});

app.get("/blogHome/", async (req, res) => {
  const user = auth.verifyToken(req.cookies.token);
  if (user === null) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
  const blogSuggestions = await Analytics.blogSuggestion(user.email_id);
  var suggestions = [];
  for (var i = 0; i < blogSuggestions.length; ++i) {
    const blog = await Database.getBlogById(blogSuggestions[i].blog_id);
    suggestions.push({
      title: blog.title,
      subject: blog.subject,
      link: "/blog/" + blog.blog_id,
      action: "Open",
    });
  }
  res.render("suggestion_page", {
    suggestion_title: "Blog Home",
    username: user.username,
    home:'active',
    hint: 'Blogs you might like, based on your activity',
    email: user.email_id,
    suggestions,
  });
});

app.get("/create_blog",async (req,res)=>{
  let cur_user = auth.verifyToken(req.cookies.token)
  res.render('create_blog',{
    create:'active',
    username: cur_user.username,
    email: cur_user.email_id
  })
})

app.get("/user_suggestions/", async (req, res) => {
  const cur_user = auth.verifyToken(req.cookies.token);
  if (cur_user === null) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
  const userSuggestions = await Analytics.userSuggestion(cur_user.email_id);
  var suggestions = [];
  for (var i = 0; i < userSuggestions.length; ++i) {
    const user = await Database.getUserDetail(userSuggestions[i].email_id);
    suggestions.push({
      title: user.username,
      subject: user.email_id,
      link: "/user/" + user.email_id,
      action: "See",
    });
  }
  res.render("suggestion_page", {
    suggestion_title: "Blogger suggestions",
    user_sug:'active',
    hint: 'People you might like, based on your activity',
    username: cur_user.username,
    email: cur_user.email_id,
    blog_suggestion: false,
    user_suggestion: "page",
    suggestions,
  });
});


app.get("/login", (req, res) => 
  res.render("login", { layout: "no_nav_main" })
)

app.get("/sign_up/", (req, res) =>
  res.render("signup", { layout: "no_nav_main" })
)

app.get("/user/:id/", async (req, res) => {
  // email_id is the current user email_id
  const cur_user = auth.verifyToken(req.cookies.token);
  if (cur_user === null) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
  const user = await Database.getUserDetail(req.params.id);
  const follower = await Database.getFollowerCount(req.params.id);
  const following = await Database.getFollowingCount(req.params.id);
  const blog_count = await Database.getBlogCount(req.params.id);
  const isFollowing =
    (await Database.isFollowing(cur_user.email_id, req.params.id)) == 1;
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
    trg_username: user.username,
    name: user.name,
    trg_email_id: user.email_id,
    email: cur_user.email_id,
    username: cur_user.username,
    following,
    follower,
    isFollowing,
    blog_count,
    blogs,
    chart_load_function,
    user_email: cur_user.email_id,
  });
});

app.get("/trending/", async (req, res) => {
  const cur_user = auth.verifyToken(req.cookies.token);
  if (cur_user === null) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
  const blogs = await Database.getBlogSortedByViews();
  const suggestions = blogs.map((b) => {
    return {
      title: b.title,
      subject: b.subject,
      action: "Open",
      link: "/blog/" + b.blog_id,
    };
  });
  res.render("suggestion_page", {
    trending: 'active',
    suggestion_title: "Trending blogs",
    suggestions,
    username: cur_user.username,
    email: cur_user.email_id
  });
});

//Database API routes
app.use("/database/", require(path.join(__dirname, "routes", "databaseAPI")));

//Tracking API routes
app.use("/tracking/", require(path.join(__dirname, "routes", "trackingAPI")));

//Like and comment API routes
app.use("/api/", require(path.join(__dirname, "routes", "likeCommentAPI")));

// Follow API
app.post("/follow_user/", async (req, res) => {
  const { follower, following } = req.body;
  //console.log(follower, following);
  try {
    await Database.followUser(follower, following);
  } catch (e) {
    console.log(e.stack);
  }

  res.redirect("/user/" + following);
});

app.post("/unfollow_user", async (req, res) => {
  const { follower, following } = req.body;
  //console.log(follower, following);
  try {
    await Database.unfollowUser(follower, following);
  } catch (e) {
    console.log(e.stack);
  }

  res.redirect("/user/" + following);
});

app.get("/logout", (req, res) => {
  let user = auth.verifyToken(req.cookies.token)
  if (user != null) {
    auth.deleteToken(req.cookies.token)
  }
  res.clearCookie("token")
  res.redirect("/login")
});

//route for all invalid url
app.get("*", function (req, res) {
  res.redirect("/login");
});
