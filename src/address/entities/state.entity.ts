import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class State {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the state',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'California',
    description: 'The name of the state',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the country',
  })
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
