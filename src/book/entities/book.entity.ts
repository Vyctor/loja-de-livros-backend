import { Author } from '../../author/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @Column({
    default: true,
  })
  active: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Author)
  @JoinTable({
    name: 'book_authors',
  })
  author: Author;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
