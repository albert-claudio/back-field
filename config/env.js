import dotenv from 'dotenv';
dotenv.config()
import path from 'path';

const loadEnv = () => {
    const envPath = process.env.NODE_ENV === 'test' ? 
    '.env.test' : '.env';

    dotenv.config({
        path: path.resolve(process.cwd(), envPath)
    });

    const requiredVars = ['MONGO_URI', 'CLOUDINARY_CLOUD_NAME'];
    requiredVars.forEach(varName => {
        if(!process.env[varName]) {
            throw new Error(`Variavel de ambiente ${varName} não definida`);
        }
    })
}

export default loadEnv;