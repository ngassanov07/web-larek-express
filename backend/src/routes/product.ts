import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products';
import { validateProduct } from '../middlewares/validation';

const router = Router();

router.get('/product', getProducts);
router.post('/product', validateProduct, createProduct);

export default router;
