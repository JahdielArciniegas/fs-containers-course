const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const { MONGO_URL } = require("../util/config");

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
}

module.exports = {
  Todo,
};
