/* all analytics related functions */
const similarity = require("compute-cosine-similarity");
const Database = require("./database");

function toVector(s) {
  var vector = [];
  for (var i = 0; i < s.length; ++i) {
    vector.push(Number(s[i]));
  }
  return vector;
}

// blog suggestion
const blogSuggestion = async (email_id) => {
  const { interests } = await Database.getUserDetail(email_id);
  const blogCategories = await Database.getBlogCategories();
  const interestVector = toVector(interests);

  var similarityArr = [];
  for (var i = 0; i < blogCategories.length; ++i) {
    similarityArr.push({
      similarity: similarity(
        interestVector,
        toVector(blogCategories[i]["categories"])
      ),
      blog_id: blogCategories[i].blog_id,
    });
  }
  similarityArr.sort((a, b) => {
    if (a.similarity < b.similarity) return 1;
    else if (a.similarity > b.similarity) return -1;
    return 0;
  });

  return similarityArr;
};

const userSuggestion = async (email) => {
  const { interests } = await Database.getUserDetail(email);
  const userInterests = await Database.getUserInterests(email);
  var similarityArr = [];
  const interestVector = toVector(interests);

  userInterests.forEach((user) => {
    similarityArr.push({
      similarity: similarity(interestVector, toVector(user.interests)),
      email_id: user.email_id,
    });
  });

  const likedBlogUsers = await Database.getLikedUsers(email);

  for (var i = 0; i < likedBlogUsers.length; ++i) {
    for (var j = 0; j < similarityArr.length; ++j) {
      if (likedBlogUsers[i]["email_id"] == similarityArr[j].email_id) {
        similarityArr[j].similarity += 0.5;
      }
    }
  }

  similarityArr.sort((a, b) => {
    if (a.similarity < b.similarity) return 1;
    else if (a.similarity > b.similarity) return -1;
    return 0;
  });

  return similarityArr;
};

module.exports = { blogSuggestion, userSuggestion };
