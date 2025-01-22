import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'text' })
  user_name: string;

  @Column({ type: 'text' })
  user_email: string;

  @Column({ type: 'int' })
  user_phone: number;

  @Column({ type: 'text' })
  user_password: string;

  @Column({ type: 'boolean', default: false })
  user_is_admin: boolean;

  @Column({ type: 'boolean', default: false })
  user_is_banned: boolean;

  @Column({ type: 'text' })
  user_provider: string;

  @CreateDateColumn()
  user_created_at: Date;

  @UpdateDateColumn()
  user_updated_at: Date;
}
