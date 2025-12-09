import http from 'http';
import { app } from '../../app';
import { PORT } from '../../config/config';
import { wsProxy } from '../../infraestructure/routes/proxy_routes';

const startServer = () => {
  const server = http.createServer(app);

  // 🔥 Handle WebSocket upgrade for socket.io proxy
  server.on('upgrade', (req, socket, head) => {
    console.log('🔌 [Gateway] WebSocket upgrade request:', req.url);
    if (req.url?.startsWith('/socket.io')) {
      // URL already includes /socket.io, proxy directly
      console.log('🔌 [Gateway] Forwarding WebSocket upgrade to messaging-service');
      wsProxy.upgrade(req, socket as any, head);
    } else {
      console.log('🔌 [Gateway] Unknown WebSocket path, ignoring:', req.url);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} `);
  });
};

export { startServer };