import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { AuthGuard } from 'src/guards/authorization.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/custom-validators/roles.decorator';
import { Role } from 'src/users/roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProductService(createProductDto);
  }

  @Post('category')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategoryService(createCategoryDto);
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAllProductsService();
  }

  @Get('category')
  findCategories() {
    return this.productsService.getCategories();
  }

  @Get('category/:id')
  findCategory(@Param('id') id: string) {
    return this.productsService.getCategory(id);
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProductService(id);
  }

  @Put('category/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    console.log(updateCategoryDto);
    return this.productsService.updateCategoryService(id, updateCategoryDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProductService(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
