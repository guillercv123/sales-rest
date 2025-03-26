import express from 'express';
// @ts-ignore
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

export default app;