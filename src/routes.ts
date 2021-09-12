import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { ensuredAuthenticated } from './middleware';

export const router = Router();

interface ProductsDTO {
  id: string;
  name: string;
  description: string;
  price: number;
}

const products: ProductsDTO[] = [];

router.get('/products/:id', (request, response) => {
  const { id } = request.params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return response.status(404).send({ message: 'Product was not found!' });
  }

  return response.json(product);
});

router.get('/products/findByName', (request, response) => {
  const { name } = request.query;
  const product = products.filter((item) => item.name.includes(String(name)));

  if (!product) {
    return response.status(404).send({ message: 'Product was not found!' });
  }

  return response.json(product);
});

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
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});
