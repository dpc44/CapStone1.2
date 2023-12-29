import express from 'express';
import { ChangeUserDetail, getUserCreatedImage, getUserData, getUserSavedImage, login, signUp, userPostImage } from '../controllers/UserController.js';
import upload from '../config/upload.js';
const UserRoute = express.Router();
//MEthod

UserRoute.get("/getUserData", getUserData);
UserRoute.post("/signup", signUp);
UserRoute.post("/login", login);
UserRoute.get("/getUserSavedImage", getUserSavedImage);
UserRoute.get("/getUserCreatedImage", getUserCreatedImage);
UserRoute.put("/ChangeUserDetail", upload.single("ImageAvatar"),ChangeUserDetail);
UserRoute.post(
    "/userPostImage",
    upload.single("ImagePost"),
    userPostImage
)
export default UserRoute;