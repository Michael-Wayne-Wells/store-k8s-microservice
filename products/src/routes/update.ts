import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@mwproducts/common';
import { Product } from '../models/product';

const router = express.Router();

router.put(
  '/api/products/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError();
    }
    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(product);
  }
);

export { router as updateProductRouter };
