import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'La categoria no puede estar vacia' })
  @IsString({ message: 'La categoria debe ser un texto' })
  category_name: string;

  @IsString({ message: 'La categoria padre debe ser un texto' })
  @IsOptional()
  parent_id?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
