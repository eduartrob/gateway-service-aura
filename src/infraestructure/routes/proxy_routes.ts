import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

const router = Router();

const MICROSERVICES = {
    auth: process.env.AUTH_URL,     
    chat: process.env.CHAT_URL,
    posts: process.env.POSTS_URL,
    notifications: process.env.NOTIFICATIONS_URL
};

// Proxy para el servicio de Autenticación
router.use('/auth', createProxyMiddleware({
    target: MICROSERVICES.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '',
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`Petición redirigida al servicio de autenticación: ${req.method} ${req.originalUrl}`);
            fixRequestBody(proxyReq, req, res);
        },
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