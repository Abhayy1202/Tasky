import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addUsersToTask, registerAdmin } from "../controllers/admin.controller.js";
import { createTask, updateTask } from "../controllers/task.controller.js";
import { registerUser } from "../controllers/user.controller.js";

const router= Router();

router.use(verifyJWT)
router.route("/assignTask").patch(verifyJWT,addUsersToTask)
router.route("/tasks").post(createTask);
router.route("/update/:taskId").patch(updateTask);
router.route("/register").post(registerUser,registerAdmin)

export default router;