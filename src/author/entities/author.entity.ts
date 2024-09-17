import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Author {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the author',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'email@mail.com',
  })
  @Column({
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the author',
  })
  @Column({
    length: 100,
  })
  name: string;

  @ApiProperty({
    example: 'John Doe is a great author',
    description: 'The description of the author',
  })
  @Column({
    length: 400,
  })
  description: string;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  @Column({
    default: true,
  })
  active: boolean;

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
