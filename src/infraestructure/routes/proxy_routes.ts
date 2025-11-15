import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { MICROSERVICES } from '../../config/config';
import path from 'path';

const router = Router();

const onProxyRes = (proxyRes: any, req: any, res: any) => {
    console.log(
        `[Gateway] Proxy Exitoso: ${req.method} ${req.originalUrl} -> Microservicio respondió con ${proxyRes.statusCode}`
    );
};

const onError = (err: any, req: any, res: any) => {
    console.error(
        `[Gateway] Proxy ERROR: ${req.method} ${req.originalUrl} -> ${err.message}`
    );
    if (!res.headersSent) {
        res.status(502).json({ message: 'Error de conexión con el servicio (Bad Gateway).' });
    }
};

// Proxy para el servicio de Autenticación
router.use('/auth', createProxyMiddleware({
    target: MICROSERVICES.auth,
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const newPath = '/api/auth' + path;
        console.log(`[Gateway] PathRewrite: ${path} -> ${newPath}`); 
        return newPath;
    },
    on: {
        proxyReq: fixRequestBody,
        proxyRes: onProxyRes,
        error: onError,
    }
}));


// Proxy para el servicio de Chat
router.use('/chat', createProxyMiddleware({
    target: MICROSERVICES.chat,
    changeOrigin: true,
    pathRewrite: {
        '^/api/chat': '',
    },
    on: {
        proxyReq: fixRequestBody,
    }
}));

// Proxy para el servicio de Publicaciones
router.use('/posts', createProxyMiddleware({
    target: MICROSERVICES.posts,
    changeOrigin: true,
    pathRewrite: {
        '^/api/posts': '',
    },
    on: {
        proxyReq: fixRequestBody,
    }
}));

// Proxy para el servicio de Notificaciones
router.use('/notifications', createProxyMiddleware({
    target: MICROSERVICES.notifications,
    changeOrigin: true,
    pathRewrite: {
        '^/api/notifications': '',
    },
    on: {
        proxyReq: fixRequestBody,
    }
}));



export default router;