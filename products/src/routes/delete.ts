import express, { Request, Response } from 'express';
import { Product } from '../models/product';
import {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
} from '@mwproducts/common';
import { ProductDeletedPublisher } from '../events/publishers/product-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.delete('/api/products/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError();
  }
  if (product.orderId) {
    throw new BadRequestError('Cannot delete a reserved product');
  }
  if (product.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  try {
    await Product.deleteOne({ _id: product.id });
  } catch (err) {
    throw new Error(err);
  }
  res.send('success');
});

export { router as deleteProductRouter };
