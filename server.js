import express from 'express';
import { errorHandler, notFound } from './middleware/errorHandler';
import securityMiddleware from './middleware/security';
import { apiLimiter, authLimiter } from './middleware/rateLimit';
import loadEnv from './config/env';
import connectDB from './config/db';
import logger from './config/logger';



require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;


//Loggers 
logger.info('Servidor iniciado com sucesso');
logger.warn('Alerta: uso alto de memória');
logger.error('Erro ao conectar no banco de dados');
logger.debug('Requisição recebida: /api/users');


//MIddleware
app.use(securityMiddleware);
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//Carregar variáveis de ambiente
loadEnv();

//Rotas
app.use('/api/videos', videosRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

//Conexão com o banco de dados
connectDB();

//ROTAS
app.get('/', (req, res) =>{
    res.status(200).json({status: 'OK', message: 'API funcionando!'})  
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})