import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { ProductsRepository } from '../database/repositories/ProductsRepository';
import { AppError } from '../errors/AppError';

interface ProductsDTO {
  id: string;
  name: string;
  description: string;
  price: number;
}

class ProductController {
  async getProductById(request: Request, response: Response) {
    const { id } = request.params;

    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOne({ id });

    if (!product) {
      throw new AppError('Product was not found!', 404);
    }

    return response.json(product);
  }

  async getProductByName(request: Request, response: Response) {
    const { name } = request.query;

    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOne({ where: { name: name } });

    if (!product) {
      return response.status(404).send({ message: 'Product was not found!' });
    }

    return response.json(product);
  }
}

export { ProductController };
