import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AppJwt = JwtPayload & {
    sub: string | number;
    name?: string;
    email?: string;
};

export const authGuard: RequestHandler = (req: Request & { user?: AppJwt }, res: Response, next: NextFunction): void => {
    const auth = req.headers['authorization'];
    const token = typeof auth === 'string' && auth.startsWith('Bearer ')
        ? auth.slice(7)
        : undefined;

    if (!token) {
        res.status(401).json({ error: 'Missing token' });
        return; // ✅ retornar void
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AppJwt;
        (req as any).user = decoded;
        next(); // ✅ continuar
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
        return; // ✅ retornar void
    }
};
