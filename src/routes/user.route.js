import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register").post( upload.fields([
    {name : "avatar",
    maxCount: 1}, 
    {name : "coverImage",
    maxCount: 1}
]) , registerUser); 

router.route("/login").post(loginUser);

/**protected routes */
router.route("/logout").post(verifyJwt, logoutUser)

export default router;