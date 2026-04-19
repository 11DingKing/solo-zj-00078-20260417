const express = require("express");
const router = express.Router();
const passport = require("passport");

const params_validator = require("../helpers/params-validator");
const { errorLogger } = require("../helpers/logger");

const Joi = require("joi");

const Todo = require("../models/todo");

router.get(
  "/",
  passport.authenticate("user", { session: false }),
  (req, res, next) => {
    Todo.getTodosByUserId(req.user._id, (err, todos) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      res.status(200).json({ success: true, todos: todos });
    });
  }
);

router.post(
  "/",
  passport.authenticate("user", { session: false }),
  params_validator.validateParams({
    title: Joi.string().min(1).max(200).required(),
  }),
  (req, res, next) => {
    const newTodo = new Todo({
      title: req.body.title,
      user: req.user._id,
    });

    Todo.addTodo(newTodo, (err, todo) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      res.status(200).json({
        success: true,
        msg: "Todo added successfully.",
        todo: todo,
      });
    });
  }
);

router.put(
  "/:id",
  passport.authenticate("user", { session: false }),
  params_validator.validateParams({
    completed: Joi.boolean().required(),
  }),
  (req, res, next) => {
    Todo.getTodoById(req.params.id, (err, todo) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!todo) {
        return res.status(404).json({ success: false, msg: "Todo not found." });
      }
      if (!todo.user.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          msg: "Not authorized to modify this todo.",
        });
      }

      Todo.updateTodo(req.params.id, { completed: req.body.completed }, (err, updatedTodo) => {
        if (err) {
          errorLogger.error(err);
          return res
            .status(422)
            .json({ success: false, msg: "Something went wrong." });
        }
        res.status(200).json({
          success: true,
          msg: "Todo updated successfully.",
          todo: updatedTodo,
        });
      });
    });
  }
);

router.delete(
  "/:id",
  passport.authenticate("user", { session: false }),
  (req, res, next) => {
    Todo.getTodoById(req.params.id, (err, todo) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!todo) {
        return res.status(404).json({ success: false, msg: "Todo not found." });
      }
      if (!todo.user.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          msg: "Not authorized to delete this todo.",
        });
      }

      Todo.deleteTodo(req.params.id, (err) => {
        if (err) {
          errorLogger.error(err);
          return res
            .status(422)
            .json({ success: false, msg: "Something went wrong." });
        }
        res.status(200).json({
          success: true,
          msg: "Todo deleted successfully.",
        });
      });
    });
  }
);

module.exports = router;
