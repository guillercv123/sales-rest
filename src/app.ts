import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import userRoutes from './routes/user.routes';
import loginRoutes from './routes/login.routes';
import authRoutes from './routes/auth.routes';
import clientRoutes from "./routes/client.routes";
import TypeDocumentRoute from "./routes/typeDocument.route";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/type-document', TypeDocumentRoute);
export default app;