import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({ title: 'book', price: 20 });
};
it('returns a list of products', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/products').send().expect(200);

  expect(response.body.length).toEqual(3);
});
