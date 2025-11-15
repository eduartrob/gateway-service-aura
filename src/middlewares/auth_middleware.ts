import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/recover-password'
    ];

    const isPublicPath = publicPaths.some(publicPath => req.path.startsWith(publicPath));

    if (isPublicPath) {
        return next(); // Es pública, deja que pase sin validar token
    }

    // (FASE 4: Lógica de Autenticación)
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: No se proporcionó token.' });
    }

    // Lógica de verificación de token...
    console.log('Token recibido para ruta protegida:', token);

    next();
};