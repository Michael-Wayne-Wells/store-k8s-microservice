import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@mwproducts/common';
it('returns 404 if order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'sdfdsf',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it('returns 401 if order does not belong to user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'sdfdsf',
      orderId: order.id,
    })
    .expect(401);
});
it('returns 400 if order when purchasing cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({ orderId: order.id, token: 'asdf' })
    .expect(400);
});
