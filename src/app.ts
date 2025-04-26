import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import TypeDocumentRoute from "./routes/typeDocument.route";
import ClientRoutes from "./routes/client.routes";
import LoginRoutes from "./routes/login.routes";
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', UserRoutes);
app.use('/login', LoginRoutes);
app.use('/auth', AuthRoutes);
app.use('/client', ClientRoutes);
app.use('/type-document', TypeDocumentRoute);
export default app;