import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async ( ) => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);  

        //EVENTOS DE CONEXÃO
        mongoose.connection.on('connected', () => {
            logger.info('Mongoose conectado ao DB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`Erro: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose desconectado do DB');
        });
    }catch(error){
        logger.error(`Erro de conexão: ${error.message}`);
        process.exit(1);
    }
}

//configuarações globais do Mongoose
mongoose.set('strictQuery', true);
mongoose.set('debug', process.env.NODE_ENV === 'development');

const shutDown = async () => {
    await mongoose.connection.close();
    process.exit(0);
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

export default connectDB;