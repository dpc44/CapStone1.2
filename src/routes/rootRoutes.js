import express from 'express';
import UserRoute from './UserRoutes.js';
import PostRoute from './PostRoutes.js';


const rootRoute = express.Router();
rootRoute.use("/user", UserRoute);
rootRoute.use("/post", PostRoute);
export default rootRoute;