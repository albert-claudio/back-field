import helmet from 'helmet';
import cors from 'cors';

const securityMiddleware = [
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'trusted.cdn.com'],
            imgSrc: ["'self'", 'data:', 'https://res.cloudinart.com'],
            mediaSrc: ["'self'", 'https://res.cloudinary.com'],
        }
    }),
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
];

export default securityMiddleware;