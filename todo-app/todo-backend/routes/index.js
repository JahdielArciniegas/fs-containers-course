const express = require("express");
const router = express.Router();
const redis = require("../redis");

const configs = require("../util/config");

let visits = 0;

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
  });
});

router.get("/statistics", async (req, res) => {
  let pending_todos = await redis.get("pending_todos");

  if (!pending_todos) {
    await redis.set("pending_todos", "0");
    pending_todos = 0;
  } else {
    pending_todos = JSON.parse(pending_todos);
  }

  res.send({
    added_todos: pending_todos,
  });
});

module.exports = router;
