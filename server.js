require("dotenv").config();
const express = require("express");
const path = require("path");
const Database = require("./database");
const Analytics = require("./analytics");
const exphbs = require("express-handlebars");

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

//Database.getTime();
Analytics.userSuggestion("kamal@123").then((suggestedBlogs) =>
  console.log(suggestedBlogs)
);

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("mainpage", {
    username: "user_name",
    blogs: [
      {
        title: "blog1",
      },
      {
        title: "blog2",
      },
      {
        title: "blog3",
      },
      {
        title: "blog4",
      },
    ],
  });
});

app.use(express.static(path.join(__dirname, "public"))); // servers the index.html
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//var bodyParserEncoder = parserObject.urlencoded({ extended: false });

// pages
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html"))
);
app.get("/sign_up", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "signup2.html"))
);
app.get("/home", (req, res) => res.send("home page"));
app.get("/user/:id", (req, res) => res.send("user email_id: " + req.params.id));

// api's
// database api functions
app.post("/database/sign_in", async (req, res) => {
  //console.log(req.body);
  const validity = await Database.checkUser(
    req.body["email_id"],
    req.body["password"]
  );
  //console.log(validity);
  res.json({ validity });
});
app.post("/database/sign_up", async (req, res) => {
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
  //console.log(interestVector);
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
app.get("/database/get_user_detail", async (req, res) => {
  const user = await Database.getUserDetail(req.body["email_id"]);
  //console.log(user);
  res.send(user);
});

//blog related api
app.get("/blog/get_blog_by_id", async (req, res) => {
  const blog = await Database.getBlogById(req.body["blog_id"]);
  res.send(blog);
});
app.get("/blog/get_blog_by_title", async (req, res) => {
  const blogs = await Database.getBlogByTitle(req.body["title"]);
  res.send(blogs);
});
app.get("/blog/get_blog_by_email", async (req, res) => {
  const blogs = await Database.getBlogByEmail(req.body["email_id"]);
  res.send(blogs);
});

// testing
app.post("/testing", (req, res) => {
  console.log(req.body);
  //console.log(req);
  res.json({ response: "hello" });
});
