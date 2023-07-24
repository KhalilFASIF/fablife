import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from './ingredient.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async createIngredient(ingredient: Ingredient) {
    await this.ingredientRepository.save(ingredient);
    return `${ingredient.name} was successfully added`;
  }

  async deleteIngredient(id: number) {
    try {
      await this.ingredientRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        `id ${id} exist in some recipes`,
        HttpStatus.CONFLICT,
      );
    }
    return `Ingredient id ${id} was successfully deleted`;
  }

  async getIngredients() {
    return await this.ingredientRepository.find();
  }

  async getIngredient(id: number) {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
    });
    if (ingredient) return ingredient;
    throw new HttpException(
      `Ingredient id ${id} dosn't exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  async updateIngredient(ingredient: Ingredient) {
    if (await this.getIngredient(ingredient.id)) {
      await this.ingredientRepository.update(ingredient.id, ingredient);
      return `${ingredient.name} was successfully updated`;
    }
    throw new HttpException(
      `Ingredient id ${ingredient.id} dosn't exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
