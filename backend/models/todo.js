const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Todo = (module.exports = mongoose.model("Todo", todoSchema));

module.exports.getTodosByUserId = function (userId, callback) {
  Todo.find({ user: userId })
    .sort({ createdAt: -1 })
    .exec(callback);
};

module.exports.getTodoById = function (id, callback) {
  Todo.findById(id, callback);
};

module.exports.addTodo = function (newTodo, callback) {
  newTodo.save(callback);
};

module.exports.updateTodo = function (id, updateData, callback) {
  Todo.findByIdAndUpdate(id, updateData, { new: true }, callback);
};

module.exports.deleteTodo = function (id, callback) {
  Todo.findByIdAndDelete(id, callback);
};
