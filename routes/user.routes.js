import express from "express";
import { handleCoverPicture, handleGetAllUsers, handleGetMyProfile, handleLoginUser, handleLogoutUser, handleProfilePicture, handleRegisterUser } from "../controllers/user.controller.js";
import { restrictToLoggedInUserOnly } from "../middlewares/RestrictToLoggedInUserOnly.js";
import { upload } from "../utils/multer.js";

const router = express.Router()

router.post("/register", handleRegisterUser)
router.post("/login", handleLoginUser)
router.get("/logout", handleLogoutUser)
router.get("/me",restrictToLoggedInUserOnly, handleGetMyProfile)
router.get("/allusers", handleGetAllUsers)
// router.post("/test",upload.array("photos",3), handleTest)
router.post("/updateprofilepic",restrictToLoggedInUserOnly,upload.single("profilepic"),handleProfilePicture)
router.post("/updatecoverpic",restrictToLoggedInUserOnly,upload.single("coverpic"),handleCoverPicture)

export default router;
