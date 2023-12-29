import express from 'express';
import { DeleteImagebyImageId, GetCommentImage, GetImageUserInfor, SaveCommentToImage, checkSavedImage, getPostData, searchImage } from '../controllers/PostController.js';


const PostRoute = express.Router();
//MEthod

PostRoute.get("/getImageData", getPostData);
PostRoute.get("/searchImage",searchImage);
PostRoute.get("/GetImageUserInfor/:imageId",GetImageUserInfor);
PostRoute.get("/GetCommentImage/:imageId",GetCommentImage);
PostRoute.get("/checkSavedImage/:imageId",checkSavedImage);

PostRoute.post("/SaveCommentToImage",SaveCommentToImage);
PostRoute.delete("/DeleteImagebyImageId", DeleteImagebyImageId)

export default PostRoute;