import Video from '../models/Video'
import { deleteFile } from '../utils/cloudinary'

//@desc Buscar videos com filtros
//@route GET /api/videos

export const getVideos = async (req, res) => {
    try{
        const{page = 1, limit = 10, sort, ...filters } = req.query;

        const query = Video.find(filters)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort || '-createdAt');

        const videos = await query .exec()
        const total = await Video.countDocuments(filters);

        res.json({
            data: videos,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
};

//@desc Processar upload de video completo
//@route POST /api/videos

export const createVideo = async (req, res) => {
    try{
        if(!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado'});
        }
        //Processador metadados
        const videoData = {
            ...req.body,
            duration: req.body.duration || 0,
            resolution: req.body.resolution || '1920x1080',
            cloudinaryData: {
                public_id: req.file.public_id,
                url: req.file.secure_url,
                format: req.file.format,
            }
        };

        const video = await Video.create(videoData);

        res.status(201).json({
            success: true,
            data: video
        });
    }catch (error) {
        //Rollback no cloudinary se falhar
        if(req.file?.public_id) {
            await deleteFile(req.file.public_id);
        }
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

//@desc Atualizar video com limpeza de arquivos antigos
//@route PUT /api/videos/:id
export const updateVideo = async (req, res) => {
    try{
        const video = await Video.findById(req.params.id);

        if(!video) {
            return res.status(404).json({ error: 'Video não encontrado'});
        }
        //Se novo arquivo foi enviado
        if(req.file) {
            //Excluir arquivo antigo
            await deleteFile(video.cloudinaryData.public_id);

            video.cloudinaryData = {
                public_id: req.file.public_id,
                url: req.file.secure_url,
                format: req.file.format
            }
        }
        //Atualizar outros campos
        Object.keys(req.body).forEach(key => {
            video[key] = req.body[key];
        });

        await video.save();

        res.json({
            sucess: true,
            data: video
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

//@desc Excluir video com todos os recursos relacionados
//@route DELETE /api/videos/:id
export const deleteFile = async (req, res) => {
    try{
        const video = await Video.findByIdAndDelete(req.params.id);

        if(!video) {
            return res.status(404).json({ error: 'Video não encontrado'});
        }
        //Excluir arquivo do Cloudinary
        await deleteFile(video.cloudinaryData.public_id);

        //Excluir imagens relacionadas(se for necessario)
        //await Image.deleteMany({videoId: video._id});

        res.json({
            success: true,
            data: {}
        })
    }catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
};