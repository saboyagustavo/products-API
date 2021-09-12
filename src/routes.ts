import { Router } from 'express';

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
    return response.status(404).send({ error: 'Product was not found!' });
  }

  return response.json(product);
});

router.get('/products/findByName', (request, response) => {
  const { name } = request.query;
  const product = products.filter((item) => item.name.includes(String(name)));

  if (!product) {
    return response.status(404).send({ error: 'Product was not found!' });
  }

  return response.json(product);
});
