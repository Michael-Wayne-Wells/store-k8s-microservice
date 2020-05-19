import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Product } from '../../models/product';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const product = Product.build({
    title: 'book',
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await product.save();

  const user = global.signup();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
