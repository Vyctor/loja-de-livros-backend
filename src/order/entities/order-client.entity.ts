import { Country } from 'src/address/entities/country.entity';
import { State } from 'src/address/entities/state.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  document: string;

  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Country, (country) => country.id)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => State, (state) => state.id)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column()
  streetName: string;

  @Column()
  streetNumber: string;

  @Column()
  complement: string;

  @Column()
  zipCode: string;

  @Column()
  phone: string;
}
