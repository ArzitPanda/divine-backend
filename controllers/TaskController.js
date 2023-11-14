const User = require("../models/User.js");
const Task = require("../models/Task.js");
const bcrypt = require("bcrypt");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const user = await User.findOne({ username: req.user.username });
    const newTask = new Task({
      title,
      description,
      priority,
      status,
      user: user._id,
    });
    await newTask.save();

    user.tasks.push(newTask._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      "tasks",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ tasks: user.tasks });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const taskId = req.params.taskId;
    console.log(req.user);
    console.log(taskId);
    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      { description, priority, status },
      { new: true },
    );
    console.log(task);
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Remove task reference from the user's tasks array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { tasks: taskId } },
      { new: true },
    );

    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { createTask, deleteTask, updateTask, getTasks };
