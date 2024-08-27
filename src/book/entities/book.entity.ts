import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  title: string;

  @Column({
    length: 500,
  })
  synopsis: string;

  @Column()
  summary: string;

  @Column()
  price: number;

  @Column()
  pages: number;

  @Column({
    unique: true,
  })
  isbn: string;

  @Column()
  releaseDate: Date;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Author)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
