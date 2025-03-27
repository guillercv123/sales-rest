import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/login.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/auth', authRoutes);

export default app;