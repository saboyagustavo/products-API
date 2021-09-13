import { Router } from 'express';
import { ensuredAuthenticated } from './middleware';
import { ProductController } from './controllers/ProductController';

const router = Router();

const productController = new ProductController();
router.get('/products/find/:id', productController.getProductById);
router.get('/products/findByName/?', productController.getProductByName);
router.post('/products', ensuredAuthenticated, productController.createProduct);
router.put('/products/:id', ensuredAuthenticated, productController.updateProduct);

export { router };
