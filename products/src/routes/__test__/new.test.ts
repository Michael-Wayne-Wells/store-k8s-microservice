import request from 'supertest';
import { app } from '../../app';

it('has a route handler to /api/products for post request', async () => {
  const response = await request(app).post('/api/products').send({});
  expect(response.status).not.toEqual(404);
});
it('can be accesses only by auth user', async () => {});
it('returns err for invalid title', async () => {});
it('returns error for invalid price', async () => {});
it('creates ticket if inputs are valid', async () => {});
