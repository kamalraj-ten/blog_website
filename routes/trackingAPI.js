const express = require("express");
const Database = require("../db/database");
const router = express.Router();
const auth = require("../db/auth");

router.get("/:email_id/", async (req, res) => {
  const result = await Database.updateTracking(req.params.email_id);
  res.json({ result });
});

router.get("/:email_id/:days/", async (req, res) => {
  const result = await Database.getTracking(
    req.params.email_id,
    req.params.days
  );
  res.json(result);
});

router.post("/", (req, res) => {
  const user = auth.verifyToken(req.cookies.token);
  if (user != null) {
    const elapsedHour = req.body.elapsedTime / 3600000;
    Database.addTrackingHour(user.email_id, elapsedHour);
  }
  res.end();
});

module.exports = router;
