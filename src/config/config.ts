export const PORT = process.env.PORT;

export const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('ADVERTENCIA: No se ha definido JWT_SECRET en el archivo .env. Usando valor por defecto inseguro.');
}

export const MICROSERVICES = {
    auth: process.env.AUTH_URL || 'http://localhost:3001',
    social: process.env.POSTS_URL || 'http://localhost:3002',
    messaging: process.env.CHAT_URL || 'http://localhost:3003',
    notifications: process.env.NOTIFICATIONS_URL || 'http://localhost:3004',
    clustering: process.env.CLUSTERING_URL || 'http://localhost:8001',
    chatbot: process.env.CHATBOT_URL || 'http://localhost:8002'
};

// Debug: Ver qué valores se cargaron
console.log('🔍 [Config] Variables de entorno cargadas:');
console.log('   - process.env.AUTH_URL:', process.env.AUTH_URL);
console.log('   - process.env.POSTS_URL:', process.env.POSTS_URL);
console.log('   - process.env.CHAT_URL:', process.env.CHAT_URL);
console.log('   - process.env.NOTIFICATIONS_URL:', process.env.NOTIFICATIONS_URL);