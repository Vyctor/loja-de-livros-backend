import { Book } from '../../book/entities/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    length: 400,
  })
  description: string;

  @Column({
    default: true,
  })
  active: boolean;

  @ManyToMany(() => Book, (book) => book.author)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
