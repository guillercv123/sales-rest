import express from 'express';
// @ts-ignore
import userRoutes from './routes/user.routes.js';
const app = express();
app.get('/', (req, res) => {
    res.send('🛒 API de ventas funcionando!')
})
app.use('/users', userRoutes);

export default app;