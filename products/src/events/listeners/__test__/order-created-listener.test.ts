import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@mwproducts/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const product = Product.build({
    title: 'book',
    price: 3,
    userId: '352',
  });
  await product.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdff',
    expiresAt: 'asfsa',
    product: {
      id: product.id,
      price: product.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, product, data };
};

it('sets user id of product', async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);
  expect(updatedProduct!.orderId).toEqual(data.id);
});
it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
