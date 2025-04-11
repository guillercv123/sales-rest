import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado o malformado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};
