import { Router, Request, Response } from 'express';
import proxyRoutes from './proxy_routes';
import { authMiddleware } from '../../middlewares/auth_middleware';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Gateway is UP');
});

router.use('/api', authMiddleware);
router.use('/api', proxyRoutes);


export default router;