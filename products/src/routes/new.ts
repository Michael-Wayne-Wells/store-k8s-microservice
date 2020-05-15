import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@mwproducts/common';
import { body } from 'express-validator';
import { Product } from '../models/product';
const router = express.Router();

router.post(
  '/api/products',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater that 0'),

  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await product.save();

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
