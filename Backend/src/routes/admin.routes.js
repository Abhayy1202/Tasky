import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addUsersToTask, registerAdmin } from "../controllers/admin.controller.js";
import { createTask, updateTask } from "../controllers/task.controller.js";


const router= Router();

router.route("/register").post(registerAdmin)
router.route("/assignTask").patch(verifyJWT,addUsersToTask)
router.route("/tasks").post(verifyJWT,createTask);
router.route("/update/:taskId").patch(verifyJWT,updateTask);

export default router;