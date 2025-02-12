import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime']; // allowed file types

    if(!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Formato de arquivo não suportado'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 50 // 50MB
    }
});

const handleUpload = async (fileBuffer, resourceType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) =>{
                if(error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    })
}

export { upload, handleUpload };