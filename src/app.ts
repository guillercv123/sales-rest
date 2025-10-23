import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import TypeDocumentRoute from "./routes/typeDocument.route";
import ClientRoutes from "./routes/client.routes";
import LoginRoutes from "./routes/login.routes";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import GeneroRoute from "./routes/genero.route";
import { authGuard } from './middlewares/auth.middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', authGuard, UserRoutes);
app.use('/login', LoginRoutes);
app.use('/auth', authGuard, AuthRoutes);
app.use('/client',authGuard, ClientRoutes);
app.use('/type-document',authGuard, TypeDocumentRoute);
app.use('/genero',authGuard, GeneroRoute);
export default app;