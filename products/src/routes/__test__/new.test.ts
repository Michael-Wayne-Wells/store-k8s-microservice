import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler to /api/products for post request', async () => {
  const response = await request(app).post('/api/products').send({});
  expect(response.status).not.toEqual(404);
});
it('can be accesses only by auth user', async () => {
  await request(app).post('/api/products').send({}).expect(401);
});
it('return a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});
it('returns err for invalid title', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      price: 10,
    })
    .expect(400);
});
it('returns error for invalid price', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'skdjfks',
      price: -10,
    })
    .expect(400);
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'skdjfks',
    })
    .expect(400);
});
it('creates Product if inputs are valid', async () => {
  let products = await Product.find({});
  expect(products.length).toEqual(0);
  const title = 'productwoo';
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title,
      price: 10,
    })
    .expect(201);

  products = await Product.find({});
  expect(products.length).toEqual(1);
  expect(products[0].price).toEqual(10);
  expect(products[0].title).toEqual(title);
});
it('publishes an event', async () => {
  let products = await Product.find({});
  expect(products.length).toEqual(0);
  const title = 'productwoo';
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title,
      price: 10,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
