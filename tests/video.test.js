// tests/video.test.js
import request from 'supertest';
import app from '../server.js';
import Video from '../models/Video.js';
import { uploadFile, deleteFile } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

// Mock do Cloudinary
jest.mock('../utils/cloudinary.js', () => ({
  uploadFile: jest.fn(),
  deleteFile: jest.fn()
}));

describe('Video Controller', () => {
  let testVideo;
  const mockFile = {
    public_id: 'mock_public_id',
    secure_url: 'http://mock.url/video.mp4',
    format: 'mp4'
  };

  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await mongoose.connect(process.env.TEST_MONGO_URI);
  });

  beforeEach(async () => {
    // Criar um vídeo de teste
    testVideo = await Video.create({
      title: 'Test Video',
      cloudinaryData: {
        public_id: 'test_public_id',
        url: 'http://test.url/video.mp4',
        format: 'mp4'
      }
    });

    // Configurar mocks
    uploadFile.mockResolvedValue(mockFile);
    deleteFile.mockResolvedValue({ result: 'ok' });
  });

  afterEach(async () => {
    await Video.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /api/videos', () => {
    it('deve retornar lista paginada de vídeos', async () => {
      // Criar 15 vídeos para testar paginação
      await Video.insertMany(
        Array.from({ length: 15 }, (_, i) => ({
          title: `Video ${i + 1}`,
          cloudinaryData: mockFile
        }))
      );

      const res = await request(app)
        .get('/api/videos?page=2&limit=5')
        .expect(200);

      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 16, // 15 novos + 1 do beforeEach
        totalPages: 4
      });
    });
  });

  describe('GET /api/videos/:id', () => {
    it('deve retornar um vídeo específico', async () => {
      const res = await request(app)
        .get(`/api/videos/${testVideo._id}`)
        .expect(200);

      expect(res.body.data.title).toBe('Test Video');
    });

    it('deve retornar 404 para ID inválido', async () => {
      const res = await request(app)
        .get('/api/videos/invalid_id')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/videos', () => {
    it('deve criar um novo vídeo com upload', async () => {
      const newVideo = {
        title: 'New Video',
        description: 'Test Description'
      };

      const res = await request(app)
        .post('/api/videos')
        .field('title', newVideo.title)
        .field('description', newVideo.description)
        .attach('videoFile', Buffer.from('fake content'), 'test.mp4')
        .expect(201);

      expect(uploadFile).toHaveBeenCalled();
      expect(res.body.data.title).toBe(newVideo.title);
    });

    it('deve retornar erro 400 sem arquivo', async () => {
      const res = await request(app)
        .post('/api/videos')
        .send({ title: 'No File' })
        .expect(400);

      expect(res.body.error).toMatch(/arquivo enviado/i);
    });
  });

  describe('PUT /api/videos/:id', () => {
    it('deve atualizar metadados do vídeo', async () => {
      const updates = { title: 'Updated Title' };

      const res = await request(app)
        .put(`/api/videos/${testVideo._id}`)
        .send(updates)
        .expect(200);

      expect(res.body.data.title).toBe(updates.title);
    });

    it('deve substituir arquivo e limpar antigo', async () => {
      await request(app)
        .put(`/api/videos/${testVideo._id}`)
        .attach('videoFile', Buffer.from('new content'), 'new.mp4')
        .expect(200);

      expect(deleteFile).toHaveBeenCalledWith('test_public_id');
      expect(uploadFile).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/videos/:id', () => {
    it('deve excluir vídeo e arquivo relacionado', async () => {
      await request(app)
        .delete(`/api/videos/${testVideo._id}`)
        .expect(200);

      const deletedVideo = await Video.findById(testVideo._id);
      expect(deletedVideo).toBeNull();
      expect(deleteFile).toHaveBeenCalledWith('test_public_id');
    });

    it('deve lidar com exclusão de vídeo inexistente', async () => {
      await request(app)
        .delete(`/api/videos/${new mongoose.Types.ObjectId()}`)
        .expect(404);
    });
  });

  describe('Edge Cases', () => {
    it('deve fazer rollback se falhar após upload', async () => {
      uploadFile.mockRejectedValueOnce(new Error('Upload failed'));

      const res = await request(app)
        .post('/api/videos')
        .attach('videoFile', Buffer.from('content'), 'test.mp4')
        .expect(500);

      expect(deleteFile).toHaveBeenCalled();
      expect(res.body.error).toMatch(/Upload failed/i);
    });

    it('deve lidar com formato de arquivo inválido', async () => {
      const res = await request(app)
        .post('/api/videos')
        .attach('videoFile', Buffer.from('content'), 'test.txt')
        .expect(400);

      expect(res.body.error).toMatch(/suportado/i);
    });
  });
});