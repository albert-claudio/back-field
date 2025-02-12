import express from 'express';

import {
    uploadImage,
    getImage,
    deleteImage
} from '../controllers/imageController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Configuração para upload de imagens
const imageUpload = upload.single('imageFile');

// Rotas públicas
router.get('/', imageUpload, uploadImage);
router.get('/:id', getImage);
router.delete('/:id', deleteImage);

export default router;