import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {createTask,deleteTask,updateTask,getAllTasks} from "../controllers/task.controller.js"

const router= Router();
router.use(verifyJWT);
router.route("/").post(createTask);
router.route("update/:taskId").patch(updateTask);
router.route("delete/:taskId").delete(deleteTask);
router.route("/allTasks").get(getAllTasks);

export default router;

