const express = require("express");
const { authenticateToken } = require("../middleware/authentication.js");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/TaskController.js");

const task = express.Router();

task.post("/", authenticateToken, createTask);
task.get("/", authenticateToken, getTasks);
task.put("/:taskId", authenticateToken, updateTask);
task.delete("/:taskId", authenticateToken, deleteTask);

module.exports = task;
