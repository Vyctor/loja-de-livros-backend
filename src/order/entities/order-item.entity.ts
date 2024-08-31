import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
