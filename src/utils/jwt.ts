import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ybljbhsgsnujdymwmjkf';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_ISSUER = process.env.JWT_ISSUER || 'sales-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'sales-spa';

export type AppJwtPayload = JwtPayload & {
    sub: string | number;  // id de usuario
    name: string;
    email: string;
    // agrega claims si quieres: roles, tenant, etc.
};

export function signToken(payload: AppJwtPayload): string {
    const options: SignOptions = {
        algorithm: 'HS256',
        // @ts-ignore
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    };
    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AppJwtPayload {
    const options: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    };
    // throws si es inválido/expirado
    return jwt.verify(token, JWT_SECRET, options) as AppJwtPayload;
}
