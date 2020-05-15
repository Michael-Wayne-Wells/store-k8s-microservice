import request from 'supertest';
import { app } from '../../app';

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
it('creates ticket if inputs are valid', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'skdjfks',
      price: 10,
    })
    .expect(201);
});
