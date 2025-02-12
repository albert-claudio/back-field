import express from 'express'
import videosRoutes from './videoRoutes.js'
import imageRoutes from './imageRoutes.js'

const router = express.Router();

router.use('/videos', videosRoutes);
router.use('/images', imageRoutes);

//Rota health check
router.get('/', (req, res) => {
    res.status(200).json({status: 'OK', timestamp: new Date()})
})

export default router;