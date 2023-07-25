import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Entity()
export class Composition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ingredient, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient_id: number;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe_id: number;

  @Column({ type: 'int' })
  quantity: number;
}
