import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests
    message: 'Você excedeu o limite de requisições, espere 15 minutos para tentar novamente'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 requests
    message: 'Você excedeu o limite de requisições, espere 1 hora para tentar novamente'
})

export { apiLimiter, authLimiter };