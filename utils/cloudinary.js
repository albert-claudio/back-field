const cloudinary = require('cloudinary').v2;
const { format } = require('path');
const { Readable } = require('stream');
const logger = require('./config/logger');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/** 
 * Converte buffer para stream legivel
 * @param {Buffer} buffer
 * @returns {Readable}
 */

const bufferToStream = buffer => {
    const readable = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    })
    return readable;
}

/**
 * Upload generico para Cloudinary
 * @param {Buffer} fileBuffer - Buffer do arquivo
 * @param {Object} options - Opções do Cloudinary
 * @returns {Promise<Object>}
 */

const uploadFile = async (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if(error) {
                    logger.error('Cloudinary upload error:', error);
                    reject(new Error('Falha no upload do arquivo'));
                }else{
                    resolve(result);
                }
            }
        );
        bufferToStream(fileBuffer).pipe(uploadStream);
    }) ;
};

/**
 * Upload de imagem com otimizações
 * @param {Buffer} imageBuffer
 * @param {Object} [options]
 * @returns {Promise<Object>} - Resultado do upload
 */

const uploadImage = async (imageBuffer, options = {}) =>{
    const defaultOptions = {
        folder: 'images',
        quality: 'auto:best',
        format: 'webp',
        transformation: [
            { width: 1920, crop: 'scale'},
            {quality: 'auto:good'}
        ]
    };
    return uploadFile(imageBuffer, {...defaultOptions, ...options});
}

/**
 * Upload de video para streaming
 * @param {Buffer} videoBuffer
 * @param {Object} [options]
 * @returns {Promise<Object>} 
 */

const uploadVideo = async (videoBuffer, options = {}) => {
    const defaultOptions = {
        resource_type: 'video',
        chunk_size: 6000000, // 6MB chunks
        folder: 'videos',
        eager: [{
            format: 'm3u8',
            streaming_profile: 'full_hd',
            transformation: [{ quality: 'auto:best'}]
        }],
        eager_async: true
    };
    return uploadFile(videoBuffer, {...defaultOptions, ...options});
}

/**
 * Exclui arquivo do Cloudinary
 * @param {String} publicId
 * @returns {Promise<Object>}
 */

const deleteFile = async (publicId) => {
    try{
        return await cloudinary.uploader.destroy(publicId, {
            invalidate: true
        });
    }catch(error){
        logger.error('Cloudinary delete error:', error);
        throw new Error('Falha ao excluir arquivo');
    }
}

/**
 * Gera URL assinada para streaming seguro
 * @param {String} publicId
 * @param {Object} [options]
 * @returns {String}
 */

const generateSecureStreamURL = (publicId, options = {}) => {
    const defaultOptions = {
        resource_type: 'video',
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hora
    };

    return cloudinary.url(publicId, {
        ...defaultOptions,
        ...options,
        sign_url: true
    });
}

module.exports = {
    uploadImage,
    uploadVideo,
    deleteFile,
    generateSecureStreamURL,
    bufferToStream
}