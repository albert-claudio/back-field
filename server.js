import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import securityMiddleware from './middleware/security.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import loadEnv from './config/env.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import videosRoutes from './routes/videoRoutes.js';
import morgan from 'morgan';
import cors from 'cors';

// Carregar variáveis de ambiente
loadEnv();

// Inicialização
const app = express();
const PORT = process.env.PORT || 5000;

// Loggers 
logger.info('Servidor iniciado com sucesso');
logger.warn('Alerta: uso alto de memória');
logger.error('Erro ao conectar no banco de dados');
logger.debug('Requisição recebida: /api/users');

// Middleware
app.use(securityMiddleware);
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// Rotas
app.use('/api/videos', videosRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Conexão com o banco de dados
connectDB();

// Rota de teste
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando!' });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;