import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, RequestHandler, Response} from 'express';

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
        return;
    }

    try {
        (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string) as AppJwt;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};
