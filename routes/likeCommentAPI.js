const express = require("express");
const Database = require("../db/database");
const router = express.Router();

router.post("/add_comment/", async (req, res) => {
  const { comment, blog_id, email_id, username } = req.body;
  await Database.putCommentOnBlog(blog_id, email_id, comment);
  res.redirect("/blog/" + blog_id);
});

router.post("/like/", async (req, res) => {
  const { liked, blog_id, email_id } = req.body;
  if (liked === "true") {
    await Database.removeBlogLike(email_id, blog_id);
    await Database.updateInterestsDecrease(email_id, blog_id);
  } else {
    await Database.LikeBlog(email_id, blog_id);
    await Database.updateInterestsIncrease(email_id, blog_id);
  }
  res.redirect("/blog/" + blog_id);
});

module.exports = router;
