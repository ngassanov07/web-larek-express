import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});

    return res.json({
      total: products.length,
      items: products,
    });
  } catch (err) {
    return next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).json(product);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(err.errors)
        .map((validationError) => validationError.message)
        .join(', ');

      return next(new BadRequestError(messages));
    }

    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('A product with this title already exists'));
    }

    return next(err);
  }
};
