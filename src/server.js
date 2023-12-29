import express, { response } from 'express'
import cors from 'cors';
import rootRoute from './routes/rootRoutes.js';
const app = express();
app.use(express.json());
app.use(cors({}));
app.use(express.static("."));
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
app.use(rootRoute);