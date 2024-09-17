import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Country {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the country',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'United States',
    description: 'The name of the country',
  })
  @Column({
    unique: true,
  })
  name: string;

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
