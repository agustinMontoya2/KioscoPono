import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import * as categories from '../helpers/categories.json';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllProductsRepository() {
    return await this.productRepository.find({ relations: ['category'] });
  }

  async findOneProductRepository(id: string) {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['category'],
    });
    if (!product) throw new BadRequestException('Producto no encontrado');
    return product;
  }

  async getCategoriesRepository() {
    const parentCategorys = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children')
      // .leftJoinAndSelect('children.children', 'subChildren')
      .where('category.parent IS NULL')
      .getMany();
    console.log(parentCategorys);

    return parentCategorys;
  }

  async getCategoryRepository(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: ['children'],
    });
    if (!category) {
      throw new BadRequestException('Categoria no encontrada');
    }
    return category;
  }

  async findOneCategoryByNameRepository(name: string) {
    const category = await this.categoryRepository.findOne({
      where: { category_name: name },
    });
    return category;
  }

  async findProductByNameRepository(name: string) {
    const product = await this.productRepository.findOne({
      where: { product_name: name },
    });
    return product;
  }
  async preloadCategoriesRepository() {
    console.log(categories);

    if (!Array.isArray(categories)) {
      throw new Error('El archivo de categorias no es un array');
    }
    for (const category of categories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { category_name: category.category_name },
      });

      if (!existingCategory) {
        if (!category.category_name) {
          throw new Error('Cada categoria debe tener un nombre');
        }

        const parentCategory = category.parent
          ? await this.categoryRepository.findOne({
              where: { category_name: category.parent },
            })
          : null;

        const newCategory = this.categoryRepository.create({
          category_name: category.category_name,
          parent: parentCategory,
        });

        await this.categoryRepository.save(newCategory);
      }
    }
  }

  async createProductRepository(product, category) {
    product.category = category;

    const existingProduct = await this.productRepository.findOne({
      where: { product_name: product.product_name },
    });

    if (existingProduct) throw new BadRequestException('El producto ya existe');
    await this.productRepository.create(product);
    return await this.productRepository.save(product);
  }

  async createCategoryRepository(category, parent) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { category_name: category },
    });

    const newCategory = new Category();
    newCategory.category_name = category;
    if (existingCategory)
      throw new BadRequestException('La categoria ya existe');
    if (parent) newCategory.parent = parent;
    return await this.categoryRepository.save(newCategory);
  }

  async updateProductRepository(id: string, product) {
    console.log(product);

    await this.productRepository.update(id, product);

    const updatedProduct = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['category'],
    });

    return updatedProduct;
  }

  async updateCategoryRepository(id: string, category) {
    console.log(category);

    await this.categoryRepository.update(id, category);

    const updatedCategory = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: ['children'],
    });
    return updatedCategory;
  }
}
