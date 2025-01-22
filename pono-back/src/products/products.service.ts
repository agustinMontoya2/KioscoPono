import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { isUUID } from 'class-validator';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(private readonly productRepository: ProductRepository) {}

  async onModuleInit() {
    await this.preloadCategories();
  }

  async preloadCategories() {
    return await this.productRepository.preloadCategoriesRepository();
  }

  async getCategories() {
    return await this.productRepository.getCategoriesRepository();
  }

  async getCategory(id: string) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');
    return await this.productRepository.getCategoryRepository(id);
  }

  async findOneCategoryByName(name: string) {
    return await this.productRepository.findOneCategoryByNameRepository(name);
  }

  async createProductService(createProductDto: CreateProductDto) {
    const category = await this.getCategory(createProductDto.category_id);
    return this.productRepository.createProductRepository(
      createProductDto,
      category,
    );
  }

  async createCategoryService(createCategoryDto: CreateCategoryDto) {
    const { parent_id, category_name } = createCategoryDto;
    let parent = null;
    if (parent_id) {
      parent = await this.getCategory(parent_id);
    }
    return await this.productRepository.createCategoryRepository(
      category_name,
      parent,
    );
  }

  async findAllProductsService() {
    return await this.productRepository.findAllProductsRepository();
  }

  findOneProductService(id: string) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');
    return this.productRepository.findOneProductRepository(id);
  }

  findOneProductByNameService(name: string) {
    return this.productRepository.findProductByNameRepository(name);
  }

  async updateProductService(id: string, updateProductDto: UpdateProductDto) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');
    const {
      product_name,
      product_description,
      product_price,
      product_stock,
      product_neto,
      category_id,
      product_image,
    } = updateProductDto;

    if (product_name) {
      const product = await this.findOneProductByNameService(product_name);
      if (product)
        throw new BadRequestException('Ya existe un producto con ese nombre');
    }
    return await this.productRepository.updateProductRepository(
      id,
      updateProductDto,
    );
  }

  async updateCategoryService(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!isUUID(id)) throw new BadRequestException('El id no es valido');

    const { category_name, parent_id } = updateCategoryDto;

    if (category_name) {
      const category = await this.findOneCategoryByName(category_name);
      if (category)
        throw new BadRequestException('Ya existe una categoria con ese nombre');
    }

    const updateData: Partial<Category> = {};

    if (parent_id) {
      const findedParent = await this.getCategory(parent_id);
      if (!findedParent) {
        throw new BadRequestException('La categoria padre no existe');
      }
      updateData.parent = findedParent;
    }

    if (category_name) {
      updateData.category_name = category_name;
    }

    return await this.productRepository.updateCategoryRepository(
      id,
      updateData,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
