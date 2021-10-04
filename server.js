require("dotenv").config();
const express = require("express");
const path = require("path");
const Database = require("./database");
const bodyParser = require("body-parser");

Database.getTime();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// api's
// database api functions
app.get("/database/sign_in", async (req, res) => {
  //console.log(req.body);
  const validity = await Database.checkUser(
    req.body["email_id"],
    req.body["password"]
  );
  //console.log(validity);
  if (validity) res.send("signed in");
  else res.send("not signed in");
});
app.get("/database/sign_up", (req, res) => res.send("sign_up"));
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
