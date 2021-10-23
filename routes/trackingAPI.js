const express = require('express')
const Database = require('../db/database')
const router = express.Router()

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
  
module.exports = router