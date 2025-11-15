import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/recover-password'
    ];

    const isPublicPath = publicPaths.some(publicPath => req.path.startsWith(publicPath));

    if (isPublicPath) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: No se proporcionó token.' });
    }
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Error interno: El secreto de autenticación no está configurado.'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
        
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido o expirado.' });
    }
};