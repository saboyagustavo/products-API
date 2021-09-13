import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { ensuredAuthenticated } from './middleware';
import { ProductController } from './controllers/ProductController';
import { Product } from './database/models/Product';

const router = Router();

interface ProductsDTO {
  id: string;
  name: string;
  description: string;
  price: number;
}

const products: ProductsDTO[] = [];

const productController = new ProductController();
router.get('/products/find/:id', productController.getProductById);
router.get('/products/findByName/?', productController.getProductByName);

router.post('/products', ensuredAuthenticated, (request, response) => {
  try {
    const { name, description, price } = request.body;

    if (!name || !description || !price) {
      return response.status(422).json({ message: 'Missing required information about the product!' });
    }

    const productAlreadyExists = products.find((product) => product.name === name);

    if (productAlreadyExists) {
      return response.status(400).json({ message: 'Product already exists!' });
    }

    const product: ProductsDTO = {
      id: uuid(),
      name,
      description,
      price,
    };

    products.push(product);

    return response.status(201).json(product);
  } catch (error: any) {
    return response.status(500).send({ message: error.message });
  }
});

router.put('/products/:id', (request, response) => {
  const { id } = request.params;
  const { name, description, price } = request.body;

  const productIndex = products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return response.status(404);
  }

  const product: ProductsDTO = Object.assign({
    name,
    description,
    price,
  });

  products[productIndex] = product;

  return response.json(product);
});

export { router };
