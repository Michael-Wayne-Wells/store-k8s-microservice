import request from 'supertest';
import { app } from '../../app';
import Mongoose from 'mongoose';

it('returns a 404 if ticket not found', async () => {
  const id = new Mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/products/${id}`).send().expect(404);
});
it('returns a ticket if ticket found', async () => {
  const title = 'boook';
  const price = 33;
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({ title, price })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
});
