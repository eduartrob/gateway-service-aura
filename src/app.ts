import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
const xssClean = require('xss-clean');
import mainRouter from './infraestructure/routes/routes';
import { wsProxy, clusteringWsProxy } from './infraestructure/routes/proxy_routes';

const app = express();

// 🔥 Socket.io proxy FIRST - before ALL other middlewares
// Must bypass helmet, cors, and body parsers for proper WebSocket handling
app.use('/socket.io', (req, res, next) => {
    console.log(`🔌 [Socket.io Middleware] ${req.method} ${req.url}`);
    next();
}, wsProxy);

// 📊 Clustering WebSocket proxy for real-time data mining dashboard
app.use('/ws/clustering', (req, res, next) => {
    console.log(`📊 [Clustering WS Middleware] ${req.method} ${req.url}`);
    next();
}, clusteringWsProxy);

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});


// app.use(limiter);
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xssClean());

app.use('/', mainRouter);

export { app };