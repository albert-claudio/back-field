import express from 'express'

import {
    getVideos,
    getVideosById,
    createVideo,
    updateVideo,
    deleteVideoFile,
} from '../controllers/videoController.js';
import { validateVideo } from '../middleware/validation.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Configuração para upload para videos
const videoUpload = upload.single('videoFile');

//Rotas Publicas
router.get('/', getVideos);
router.get('/:id', getVideosById);

//Rotas protegidas
router.post(
    '/',
    videoUpload,
    validateVideo,
    createVideo
);

router.put(
    '/:id',
    videoUpload,
    validateVideo,
    updateVideo
);

router.delete(
    '/:id',
    deleteVideoFile
)

export default router;