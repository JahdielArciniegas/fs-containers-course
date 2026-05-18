const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const pending_todos = await redis.get("pending_todos");
  const parsedPendingTodos = JSON.parse(pending_todos);
  console.log("pending todos", parsedPendingTodos);

  await redis.set("pending_todos", JSON.stringify(parsedPendingTodos + 1));

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await Todo.deleteOne({ _id: req.todo._id });
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  console.log("Updating todo", req.todo);
  const todo = await Todo.findByIdAndUpdate(
    { _id: req.todo._id },
    { done: true },
    { new: true },
  );
  res.send(todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
