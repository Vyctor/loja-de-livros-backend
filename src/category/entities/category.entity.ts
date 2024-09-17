import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Action',
    type: String,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
