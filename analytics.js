/* all analytics related functions */
const similarity = require("compute-cosine-similarity");
const Database = require("./database");

function toVector(s) {
  vector = [];
  for (var i = 0; i < s.length; ++i) {
    vector.push(s[i]);
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
  const arr = await Database.getUserInterests();
  const userInterests = arr.filter((u) => u.email_id != email);
  var similarityArr = [];
  const interestVector = toVector(interests);

  userInterests.forEach((user) => {
    similarityArr.push({
      similarity: similarity(interestVector, toVector(user.interests)),
      email_id: user.email_id,
    });
  });

  similarityArr.sort((a, b) => {
    if (a.similarity < b.similarity) return 1;
    else if (a.similarity > b.similarity) return -1;
    return 0;
  });

  return similarityArr;
};

module.exports = { blogSuggestion, userSuggestion };
