import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@mwproducts/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const product = Product.build({
    title: 'book',
    price: 3,
    userId: '352',
  });
  product.set({ orderId });
  await product.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    product: {
      id: product.id,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, product, data, orderId };
};

it('updates, publishes event and acks message', async () => {
  const { msg, data, product, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updateProduct = await Product.findById(product.id);
  expect(updateProduct!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
