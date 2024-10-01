import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
// Admin Registration
const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    throw new ApiError(409, "Admin already exists");
  }

  const admin = await Admin.create({ email, password });

  res.status(201).json(new ApiResponse("Admin registered successfully", admin));
});

// Admin Login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse("Logged in successfully", { accessToken })
    );
});

// Add users to task
const addUsersToTask = asyncHandler(async (req, res) => {
  const { taskId, userIds } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.user = [...new Set([...task.user, ...userIds])]; // Ensure no duplicates
  await task.save();

  res
    .status(200)
    .json(new ApiResponse("Users added to task successfully", task));
});

export { registerAdmin, adminLogin, addUsersToTask };
