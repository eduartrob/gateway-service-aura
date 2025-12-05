import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { MICROSERVICES } from '../../config/config';

console.log('🔧 [Gateway] Configuración de microservicios:');
console.log('   - Auth:', MICROSERVICES.auth);
console.log('   - Social:', MICROSERVICES.social);
console.log('   - Messaging:', MICROSERVICES.messaging);
console.log('   - Notifications:', MICROSERVICES.notifications);

const router = Router();

const onProxyReq = (proxyReq: any, req: any, res: any) => {
    console.log('🔄 [Gateway Proxy] Reenviando petición:');
    console.log(`   - Método: ${req.method}`);
    console.log(`   - URL original: ${req.originalUrl}`);
    console.log(`   - Path: ${req.path}`);
    console.log(`   - Destino: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);

    // ⚠️ IMPORTANTE: NO llamar fixRequestBody para multipart/form-data
    // Solo para JSON (application/json)
    const contentType = req.get('content-type') || '';

    if (contentType.includes('application/json') && req.body) {
        // Solo para JSON
        fixRequestBody(proxyReq, req);
    }
    // Para multipart/form-data, dejar que el stream fluya naturalmente
};

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
// Como router.use('/auth') elimina el prefijo, el path llega sin /auth
// Por ejemplo: /api/auth/login llega como /login
router.use('/auth', createProxyMiddleware({
    target: MICROSERVICES.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/auth/'  // Reescribir /login -> /api/auth/login
    },
    on: {
        proxyReq: onProxyReq,
        proxyRes: onProxyRes,
        error: onError,
    }
}));


// Proxy para el servicio de Messaging (Chat)
router.use('/messaging', createProxyMiddleware({
    target: MICROSERVICES.messaging,
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/v1/',  // Express ya quitó /messaging, solo añadir /api/v1/
    },
    on: {
        proxyReq: onProxyReq,
        proxyRes: onProxyRes,
        error: onError,
    }
}));

// Proxy para el servicio de Social (Posts, Profiles, Communities)
// ✅ ARREGLADO: No llamar fixRequestBody para multipart, dejar que fluya naturalmente
router.use('/social', createProxyMiddleware({
    target: MICROSERVICES.social,
    changeOrigin: true,
    pathRewrite: {
        '^/': '/api/v1/',
    },
    on: {
        proxyReq: onProxyReq,
        proxyRes: onProxyRes,
        error: onError,
    }
}));

// Proxy para el servicio de Notificaciones
router.use('/notifications', createProxyMiddleware({
    target: MICROSERVICES.notifications,
    changeOrigin: true,
    pathRewrite: {
        '^/api/notifications': '/api/v1/notifications',
    },
    on: {
        proxyReq: onProxyReq,
        proxyRes: onProxyRes,
        error: onError,
    }
}));



export default router;