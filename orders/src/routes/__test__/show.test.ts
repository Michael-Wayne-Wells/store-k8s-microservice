import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../models/product';

it('fetches the order', async () => {
  const product = Product.build({
    title: 'book',
    price: 20,
  });
  await product.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
it('returns an error if the order doesn not belong to user', async () => {
  const product = Product.build({
    title: 'book',
    price: 20,
  });
  await product.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401);
});
