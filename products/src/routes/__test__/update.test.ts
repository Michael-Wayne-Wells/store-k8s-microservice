import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if id does not exitst', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'book', price: 20 })
    .expect(404);
});
it('returns 401 if not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .send({
      title: 'book',
      price: 20,
    })
    .expect(401);
});
it('returns 401 if user does not own ticket', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'book',
      price: 20,
    });
  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'not book', price: 30 })
    .expect(401);
});
it('returns 400 if user provides invalid title or price', async () => {});
it('updates product if provided valid inputs and user authenticated', async () => {});
