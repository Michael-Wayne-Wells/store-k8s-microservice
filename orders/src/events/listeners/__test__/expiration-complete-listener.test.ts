import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { OrderStatus, ExpirationCompleteEvent } from '@mwproducts/common';
import { Product } from '../../../models/product';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'book',
    price: 30,
  });
  await product.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'ewtwe',
    expiresAt: new Date(),
    product,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, product, order, listener };
};

it('update the order status to cancelled', async () => {
  const { listener, order, product, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updateOrder = await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('emits order cancelled event', async () => {
  const { listener, order, product, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});
it('acks message', async () => {
  const { listener, order, product, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack()).toHaveBeenCalled();
});
