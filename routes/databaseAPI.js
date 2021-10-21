const express = require('express')
const Database = require('../db/database')
const router = express.Router()
const categories = Database.categories;

router.post("/sign_in", async (req, res) => {
    //console.log(req.body);
    const validity = await Database.checkUser(
      req.body["email_id"],
      req.body["password"]
    );
    //console.log(validity);
    res.json({ validity });
});

router.post("/sign_up", async (req, res) => {
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

// app.get("/database/get_user_detail", async (req, res) => {
//   const user = await Database.getUserDetail(req.body["email_id"]);
//   //console.log(user);
//   res.send(user);
// });

module.exports = router