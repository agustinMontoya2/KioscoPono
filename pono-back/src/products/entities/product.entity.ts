import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column({ type: 'text' })
  product_name: string;

  @Column({ type: 'text' })
  product_description: string;

  @Column({
    type: 'text',
    default:
      'https://res-console.cloudinary.com/dxpxzcj2i/thumbnails/v1/image/upload/v1737471481/cHVncWpqdm9hNmt4bHhuN3RpcHdfY3Y2cXlw/drilldown',
  })
  product_image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  product_price: number;

  @Column({ type: 'int', default: 0 })
  product_stock: number;

  @Column({ type: 'text', nullable: true })
  product_neto: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
