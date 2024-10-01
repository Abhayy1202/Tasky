import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {registerUser, userLogin, logoutUser,refresh_accessToken,changeCurrentPassword} from "../controllers/user.controller.js"
const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refresh_accessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;