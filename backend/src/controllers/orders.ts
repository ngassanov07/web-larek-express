import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { BadRequestError } from '../errors/BadRequestError';

type PaymentMethod = 'card' | 'online'

interface CreatedOrderBody {
  payment: PaymentMethod
  email: string
  phone: string
  address: string
  total: number
  items: string[]
}

export const createOrder = async (
  req: Request<{}, {}, CreatedOrderBody>,
  res: Response,
  next: NextFunction,
) => {
  const { total, items } = req.body;

  try {
    const products = await Product.find({ _id: { $in: items } });
    const productsById = new Map(
      products.map((product) => [product._id.toString(), product] as const),
    );
    const orderedProducts = items.map((id) => productsById.get(id.toLowerCase()));

    if (orderedProducts.some((product) => !product || product.price === null)) {
      return next(
        new BadRequestError(
          'Order contains a missing or unavailable product',
        ),
      );
    }

    const calculatedTotal = orderedProducts.reduce(
      (sum, product) => sum + (product?.price ?? 0),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Order total does not match'));
    }

    return res.status(201).json({
      id: randomUUID(),
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};
