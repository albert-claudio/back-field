const {uploadVideo} = require('../utils/cloudinary');

exports.uploadVideo = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({error: 'Nenhum arquivo enviado'})
        }
        //Fazer upload para Cloudinary
        const result = await uploadVideo(req.file.buffer, {
            folder: 'user-uploads',
            transformation: [{width: 1280, crop: 'scale'}]
        })
        //Salvar no mongoDB
        const videoData = {
            title: req.body.title,
            cloudinaryId: result.public_id,
            url: result.secure_url,
            duration: req.duration,
            format: req.format
        };
    

        res.status(201).json(videoData);
    }catch (error) {
        res.status(500).json({error: error.message})
    }
}