import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import TypeDocumentRoute from "./routes/typeDocument.route";
import LoginRoutes from "./routes/login.routes";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";
import GeneroRoute from "./routes/genero.route";
import { authGuard } from './middlewares/auth.middleware';
import MenuRoute from "./routes/menu.route";
import CustomerRoute from "./routes/customer.route";
import {errorHandler} from "./middlewares/error-handler.middleware";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', authGuard, UserRoutes);
app.use('/login', LoginRoutes);
app.use('/auth', authGuard, AuthRoutes);
app.use('/customers',authGuard, CustomerRoute);
app.use('/menu',authGuard, MenuRoute);
app.use('/type-document',authGuard, TypeDocumentRoute);
app.use('/genero',authGuard, GeneroRoute);

app.use(errorHandler);
export default app;