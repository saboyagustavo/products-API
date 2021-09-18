import { Router } from 'express';
import { ensuredAuthenticated } from './middleware';
import ProductController from './controllers/ProductController';

const router = Router();

router.get('/products/find/:id', ProductController.getProductById);
router.get('/products/findByName/?', ProductController.getProductByName);
router.post('/products', ensuredAuthenticated, ProductController.createProduct);
router.put('/products/:id', ensuredAuthenticated, ProductController.updateProduct);

export { router };
