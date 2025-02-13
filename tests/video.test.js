const request = require('supertest');
const app = require('../src/server');
const Video = require('../src/models/Video');

describe('Video API', () => {
  let testVideo;

  beforeAll(async () => {
    testVideo = await Video.create({
      title: 'Test Video',
      cloudinaryData: {
        public_id: 'test_public_id',
        url: 'http://test.url'
      }
    });
  });

  afterAll(async () => {
    await Video.deleteMany();
  });

  test('GET /api/videos - Deve listar vídeos', async () => {
    const res = await request(app)
      .get('/api/videos')
      .expect(200);

    expect(res.body.pagination.total).toBeGreaterThan(0);
  });

  test('DELETE /api/videos/:id - Deve retornar erro se não autorizado', async () => {
    await request(app)
      .delete(`/api/videos/${testVideo._id}`)
      .expect(401);
  });
});