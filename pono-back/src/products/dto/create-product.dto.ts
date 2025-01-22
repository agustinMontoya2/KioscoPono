import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 20, { message: 'El nombre debe tener entre 3 y 20 caracteres' })
  product_name: string;

  @IsNotEmpty({ message: 'La descripcion no puede estar vacia' })
  @IsString({ message: 'La descripcion debe ser un texto' })
  @Length(3, 60, {
    message: 'La descripcion debe tener entre 3 y 20 caracteres',
  })
  product_description: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser un texto' })
  product_image?: string;

  @IsNotEmpty({ message: 'El precio no puede estar vacio' })
  @IsNumber({}, { message: 'El precio debe ser un texto' })
  product_price: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un numero' })
  product_stock?: number;

  @IsOptional()
  @IsString({ message: 'El neto debe ser un texto' })
  @Length(3, 20, { message: 'El neto debe tener entre 3 y 20 caracteres' })
  product_neto?: string;

  @IsNotEmpty({ message: 'La categoria no puede estar vacia' })
  @IsString({ message: 'La categoria debe ser un texto' })
  @Length(3, 40, { message: 'La categoria debe tener entre 3 y 20 caracteres' })
  category_id: string;
}
