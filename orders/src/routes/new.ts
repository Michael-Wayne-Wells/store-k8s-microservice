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
const router = express.Router();

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
    // Run queury to look at all order to check it it contains product and not cancelled.
    const existingOrder = await Order.findOne({
      product: product,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
    if (existingOrder) {
      throw new BadRequestError('Product out of stock!');
    }

    // Calculate an expiration date

    // Build an order and save to DB

    // publish an event that an order was created

    res.send({});
  }
);

export { router as newOrderRouter };
