import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Recipe } from './recipe.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async createRecipe(recipe: any) {
    const ingredients = await this.ingredientRepository.find({
      where: {
        id: In(recipe.ingredients),
      },
    });
    const ids = ingredients.map((ingredient) => ingredient.id);
    const differences = recipe.ingredients.filter(
      (id: number) => !ids.includes(id),
    );
    if (differences.length === 0) {
      const entity = this.recipeRepository.create(recipe as Recipe);
      entity.ingredients = ingredients;
      await this.recipeRepository.save(entity);
      return `${recipe.name} was successfully added`;
    }
    throw differences.length === 1
      ? new HttpException(
          `Ingredient id ${differences[0]} dosn't exist`,
          HttpStatus.NOT_FOUND,
        )
      : new HttpException(
          `Ingredients ids ${differences.join(', ')} don't exist`,
          HttpStatus.NOT_FOUND,
        );
  }

  async deleteRecipe(id: number) {
    await this.recipeRepository.delete(id);
    return `Recipe id ${id} was successfully deleted`;
  }

  async getRecipes() {
    return await this.recipeRepository.find();
  }

  async getRecipe(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (recipe) return recipe;
    throw new HttpException(
      `Recipe id ${id} dosn't exist`,
      HttpStatus.NOT_FOUND,
    );
  }

  async updateRecipe(recipe: Recipe) {
    if (await this.getRecipe(recipe.id)) {
      await this.recipeRepository.update(recipe.id, recipe);
      return `${recipe.name} was successfully updated`;
    }
    throw new HttpException(
      `Recipe id ${recipe.id} dosn't exist`,
      HttpStatus.NOT_FOUND,
    );
  }
}
