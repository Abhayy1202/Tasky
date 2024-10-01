import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {getPriority} from "../utils/priorityHandler.js"

// Create task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, due_date, userIds } = req.body;
 priority = getPriority(due_date);
  // Check if the user is an admin
  const isAdmin = req.user && req.user.role === "admin";

  // If not admin, assign the task to the logged-in user only
  const assignedUsers = isAdmin ? userIds : [req.user._id];

  const task = new Task({
    title,
    description,
    due_date,
    priority,
    status:"TODO",
    user: assignedUsers,
  });

  await task.save();

  res.status(201).json(new ApiResponse("Task created successfully", task));
});

// Update task
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const {due_date,status} = req.body;

  const task = await Task.findone({_id: taskId,isdeleted: false});
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check if the user is allowed to update the task
  if (req.user.role !== "admin" && !task.user.includes(req.user._id)) {
    throw new ApiError(403, "You are not allowed to update this task");
  }

  if(due_date)
  {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "You are not allowed to update the Due Date");
    } else {
        
        task.due_date =new Date(due_date)
        task.priority= getPriority(due_date)
    }
  }

  if (status && ["TODO", "DONE"].includes(status)) {
    task.status = status;
  }
//   Object.assign(task, updates);
  await task.save();

  res.status(200).json(new ApiResponse("Task updated successfully", task));
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check if the user is allowed to delete the task
  if (req.user.role !== "admin" && !task.user.includes(req.user._id)) {
    throw new ApiError(403, "You are not allowed to delete this task");
  }

  task.isdeleted = true;
  await task.save();

  res.status(200).json(new ApiResponse("Task deleted successfully", task));
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  const { priority, status, dueDate, page = 1, limit = 10 } = req.query;

  const filter = {};
  // Non-admin users should only see their tasks
  if (req.user.role !== "admin") {
    filter.user = req.user._id;
  }
  if (priority !== undefined) {
    filter.priority = priority;
  }
  if (status !== undefined) {
    filter.status = status;
  }
  if (dueDate !== undefined) {
    filter.due_date = { $lte: new Date(dueDate) };
  }
  filter.isdeleted = false;


  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Query tasks with filters and pagination
  const tasks = await Task.find(filter)
    .sort({ due_date: 1 }) // Sorting by due date ascending
    .skip(skip)
    .limit(parseInt(limit));

  // Count total tasks matching the filters
  const totalTasks = await Task.countDocuments(filter);

  res.status(200).json({
    title: "Success",
    message: "Tasks fetched successfully.",
    tasks,
    page: parseInt(page),
    limit: parseInt(limit),
    totalTasks,
  });
});

export { createTask, updateTask, deleteTask, getAllTasks };
