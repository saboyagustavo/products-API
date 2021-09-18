import { Request, Response } from 'express';
import { getConnection, getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../database/repositories/ProductsRepository';
import { AppError } from '../errors/AppError';
import { v4 as uuid } from 'uuid';

interface ProductsDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: number;
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
      throw new AppError('Product was not found!', 404);
    }

    return response.json(product);
  }

  async createProduct(request: Request, response: Response) {
    try {
      const { name, description, price } = request.body;

      if (!name || !description || !price) {
        console.log('passou aqui');
        throw new AppError('Missing required information about the product!', 422);
      }

      const productsRepository = getCustomRepository(ProductsRepository);

      const productAlreadyExists = await productsRepository.findOne({ where: { name: name } });

      if (productAlreadyExists) {
        throw new AppError('Product already exists!', 409);
      }

      const product: ProductsDTO = {
        id: uuid(),
        name,
        description,
        price,
        created_at: Date.now(),
      };

      await productsRepository.save(product);

      return response.status(201).json(product);
    } catch (error: any) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  async updateProduct(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, description, price } = request.body;

      if (!name && !description && !price) {
        throw new AppError('Missing required information about the product!', 422);
      }

      const productsRepository = getCustomRepository(ProductsRepository);
      const product = await productsRepository.findOne({ id });

      if (!product) {
        throw new AppError('Product was not found!', 404);
      }

      const newProduct = await getConnection()
        .createQueryBuilder()
        .update('products')
        .set({
          name: name || product.name,
          description: description || product.description,
          price: price || product.price,
        })
        .where('id = :id', { id })
        .execute();

      const updatedProduct = await productsRepository.findOne({ id });

      return response.json(updatedProduct);
    } catch (error: any) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }
}

export default new ProductController();
