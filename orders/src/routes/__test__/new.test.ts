import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';
it('returns an error if no user', async () => {
  const productId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId })
    .expect(404);
});
it('returns an error if product reserved', async () => {
  const product = Product.build({
    title: 'book',
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await product.save();

  const order = Order.build({
    product,
    userId: 'asdfasdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(400);
});
it('reserves a ticket', async () => {
  const product = Product.build({
    title: 'book',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await product.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const product = Product.build({
    title: 'book',
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await product.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
