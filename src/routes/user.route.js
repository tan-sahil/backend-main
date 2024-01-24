import { registerUser, loginUser, logoutUser, refreshAccessToken,
    updatePassword, getLoggedInUser, updateAccountDetails, updateUserAvatar} from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").post(verifyJwt, updatePassword);
router.route("/get-logged-in-user").get(verifyJwt, getLoggedInUser);
router.route("/update-details").post(verifyJwt, updateAccountDetails);
router.route("/avatar").post(upload.single("avatar") ,verifyJwt, updateUserAvatar);
export default router;