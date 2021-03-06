import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

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
it('returns 400 if user provides invalid title or price', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 20,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 30 })
    .expect(400);
  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'sfsa', price: -19 })
    .expect(400);
});
it('updates product if provided valid inputs and user authenticated', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 20,
    });

  const update = await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'not-book', price: 30 })
    .expect(200);
  expect(update.body.title).toEqual('not-book');
  expect(update.body.price).toEqual(30);
});

it('publishes an event', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 20,
    });

  const update = await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'not-book', price: 30 })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it('rejects update if product reserved', async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'book',
      price: 20,
    });
  const product = await Product.findById(response.body.id);
  product!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await product!.save();
  const update = await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'not-book', price: 30 })
    .expect(400);
});
