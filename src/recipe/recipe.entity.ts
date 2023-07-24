import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { Ingredient } from 'src/ingredient/ingredient.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: ['breakfast', 'lunch', 'dinner'] })
  type: string;

  @ManyToMany(() => Ingredient, { onDelete: 'CASCADE' })
  @JoinTable()
  ingredients: Ingredient[];
}
