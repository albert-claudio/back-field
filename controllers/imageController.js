import Image from '../models/image'
import { deleteFile } from '../utils/cloudinary'

export const uploadImage = async (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada'})
        }

        const image = await Image.create({
        ...req.body,
        cloudinaryData: {
            public_id: req.file.public_id,
            url: req.file.secure_url,
            format: req.file.format,
            dimensions: {
                width: req.file.width,
                height: req.file.height
            }
        }
        });

        res.status(201).json({
        success: true,
        data: image
        });
    }catch (error) {
        if(req.file?.public_id) {
        await deleteFile(req.file.public_id);
        }
        res.status(400).json({
        success: false,
        error: error.message
        });
    }
};

export const getImage = async (req, res) => {
    try{
        const image = await Image.findById(req.params.id);

        if(!image) {
            return res.status(404).json({ error: 'Imagem não encontrada'});
        }
        res.json({
            success: true,
            data: image
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const deleteImage = async (req, res) => {
    try{
        const image = await Image.findByIdAndDelete(req.params.id);

        if(!image) {
            return res.status(404).json({ error: 'Imagem não encontrada'})
        }
        await deleteFile(image.cloudinaryData.public_id);

        res.json({
            success: true,
            data: {}
        });
    }catch (error) {
        res.status(400).sjon({
            success: false,
            error: error.message
        });
    }
};
