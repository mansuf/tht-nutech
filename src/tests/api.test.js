
const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'password',
      });
    token = res.body.token;
  });

  describe('Item API', () => {
    let itemId;

    it('should create a new item', async () => {
      const res = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Item',
          description: 'Test Description',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test Item');
      itemId = res.body.id || res.body._id;
    });

    it('should get all items', async () => {
      const res = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a single item', async () => {
      const res = await request(app)
        .get(`/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Item');
    });

    it('should update an item', async () => {
      const res = await request(app)
        .put(`/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Test Item',
          description: 'Updated Test Description',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Test Item');
    });

    it('should delete an item', async () => {
      const res = await request(app)
        .delete(`/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Item deleted');
    });
  });
});
