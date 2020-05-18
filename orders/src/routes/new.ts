import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@mwproducts/common';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('productId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('productId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { productId } = req.body;
    // find product user is trying to find in DB
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError();
    }

    // check if ticket is reserved
    const isReserved = await product.isReserved();
    // Run queury to look at all order to check it it contains product and not cancelled.

    if (isReserved) {
      throw new BadRequestError('Product out of stock!');
    }

    // Calculate an expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Build an order and save to DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product,
    });
    await order.save();
    // publish an event that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
