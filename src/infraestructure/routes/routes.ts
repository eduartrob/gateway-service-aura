import { Router, Request, Response } from 'express';
import proxyRoutes from './proxy_routes';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { MICROSERVICES } from '../../config/config';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Gateway is UP');
});

// ✅ Proxy para archivos estáticos (uploads) - ANTES de /api para que sea /uploads directamente
router.use('/uploads', createProxyMiddleware({
    target: MICROSERVICES.social,
    changeOrigin: true,
    pathRewrite: {
        '^/uploads': '/uploads',
    },
    on: {
        proxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(`🔄 [Gateway] Proxy upload: ${req.method} ${req.originalUrl}`);
        },
    },
}));

router.use('/api', authMiddleware);
router.use('/api', proxyRoutes);


export default router;