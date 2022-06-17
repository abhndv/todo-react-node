var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Todo = require("../models/todo");

router.get("/", function (req, res, next) {
  res.json({ title: "Nothing here!" });
});

// Get Todos
router.get("/todos", async (req, res, next) => {
  try {
    const todos = await Todo.aggregate([
      {
        $match: {
          parentTodo: { $eq: null },
        },
      },
      {
        $lookup: {
          from: "todos",
          localField: "_id",
          foreignField: "parentTodo",
          as: "subTaskCount",
        },
      },
      { $addFields: { subTaskCount: { $size: "$subTaskCount" } } },
    ]);
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// Get Todo by ID
router.get("/todos/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const todos = await Todo.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "todos",
          localField: "_id",
          foreignField: "parentTodo",
          as: "subTasks",
        },
      },
      {
        $unwind: {
          path: "$subTasks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "todos",
          localField: "subTasks._id",
          foreignField: "parentTodo",
          as: "subTasks.subTaskCount",
        },
      },
      {
        $addFields: {
          "subTasks.subTaskCount": {
            $size: "$subTasks.subTaskCount",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          text: {
            $first: "$text",
          },
          status: {
            $first: "$status",
          },
          completionDate: {
            $first: "$completionDate",
          },
          createdDate: {
            $first: "$createdDate",
          },
          parentTodo: {
            $first: "$parentTodo",
          },
          subTasks: {
            $push: "$subTasks",
          },
        },
      },
    ]);

    if (todos.length) res.json(todos);
    else next({ status: 404, message: "Invalid Task Id" });
  } catch (error) {
    next(error);
  }
});

const todoStatus = ["Pending", "InProgress", "Completed"];

// Create Todos
router.post("/todos", async (req, res, next) => {
  const { text, status, completionDate, parentTodo } = req && req.body;
  try {
    if (!text) {
      next({ status: 400, message: "Parameter text is required!" });
    } else {
      var pTodo;
      if (parentTodo) {
        pTodo = await Todo.findById(parentTodo);
        if (!pTodo) next({ status: 404, message: "Invalid Parent Task" });
      }
      const status = todoStatus[0];
      const newTodo = new Todo({
        text,
        status,
        completionDate: completionDate || null,
        parentTodo,
      });
      await newTodo.save();
      res.json({ ...newTodo["_doc"] });
    }
  } catch (error) {
    next(error);
  }
});

// Update Todos
router.put("/todos/:id", async (req, res, next) => {
  const { status } = req && req.body;
  const id = req.params.id;
  try {
    if (!(status && todoStatus.includes(status))) {
      next({ status: 404, message: "Invalid Task Status" });
    } else {
      const todo = await Todo.findById(id);
      todo.status = status;
      await todo.save();
      res.json({ todo });
    }
  } catch (error) {
    next(error);
  }
});

// Delete Todo by ID
router.delete("/todos/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const pTodo = await Todo.findById(id);
    if (!pTodo)
      next({ status: 404, message: "A todo with matching id didn't found" });
    else {
      var isValid = true,
        todoIds = [];
      if (pTodo.status == "InProgress") {
        isValid = false;
        next({
          status: 405,
          message: "Cannot delete a task which is in Progress.",
        });
      } else {
        todoIds.push(pTodo["_id"]);
        const todos = await Todo.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(id),
              // status: "InProgress",
              // "subTasks.status": "InProgress",
            },
          },
          {
            $graphLookup: {
              from: "todos",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "parentTodo",
              as: "subTasks",
            },
          },
          { $unwind: { path: "$subTasks" } },
        ]);
        if (todos.length) {
          for (var i = 0; i < todos.length; i++) {
            const x = todos[i].subTasks;
            if (x.status == "InProgress") {
              isValid = false;
              break;
            }
            if (x?._id) todoIds.push(x._id);
          }
        }
        if (isValid) {
          const result = await Todo.deleteMany({ _id: { $in: todoIds } });
          res.json(result);
        } else {
          next({
            status: 405,
            message:
              "One or more subtasks are in InProgress state. You cannot delete parent tasks when child are in InProgress.",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
