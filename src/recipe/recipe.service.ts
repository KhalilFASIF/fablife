import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';

import { Recipe } from './recipe.entity';
import { Composition } from 'src/composition/composition.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  async getRecipes() {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    const results = await this.dataSource
      .getRepository(Composition)
      .createQueryBuilder('composition')
      .innerJoinAndSelect('composition.recipe_id', 'recipe')
      .innerJoinAndSelect('composition.ingredient_id', 'ingredient')
      .getMany();
    const entites = this.extractRecipes(results);

    response.statusCode = HttpStatus.OK;
    response.message = entites;
    return response;
  }

  async getRecipe(id: number) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const results = await this.dataSource
        .getRepository(Composition)
        .createQueryBuilder('composition')
        .innerJoinAndSelect('composition.recipe_id', 'recipe')
        .innerJoinAndSelect('composition.ingredient_id', 'ingredient')
        .where('composition.recipe_id = :recipeId')
        .setParameter('recipeId', id)
        .getMany();
      const entites = this.extractRecipes(results);

      if (entites[0]) {
        response.statusCode = HttpStatus.OK;
        response.message = entites[0];
      } else throw new Error(`Recipe id ${id} dosn't exist`);
    } catch (error) {
      response.statusCode = HttpStatus.NOT_FOUND;
      response.message = (error as Error).message;
    }

    return response;
  }

  async createRecipe(entity: any) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    const sameRecipes = await this.recipeRepository.find({
      where: { name: entity.name },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const recipe = new Recipe();
      recipe.name = entity.name;
      recipe.type = entity.type;
      const createdRecipe = await queryRunner.manager
        .getRepository(Recipe)
        .save(recipe);
      entity.id = createdRecipe.id;

      const compositions = this.extractCompositions(entity);
      const createdCompositions = await queryRunner.manager
        .getRepository(Composition)
        .save(compositions);

      await queryRunner.commitTransaction();
      if (sameRecipes.length === 0) console.log('BAZINGA');
      response.statusCode = HttpStatus.CREATED;
      response.message = createdRecipe;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      switch (true) {
        case error instanceof QueryFailedError:
          response.statusCode = HttpStatus.NOT_FOUND;
          response.message = (error as QueryFailedError).driverError.detail;
          break;
        case error instanceof Error:
          response.statusCode = HttpStatus.BAD_REQUEST;
          response.message = (error as Error).message;
          break;
      }
    } finally {
      await queryRunner.release();
    }

    return response;
  }

  async updateRecipe(entity: any) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { message: recipe } = await this.getRecipe(entity.id);
      if (recipe instanceof Recipe) {
        const updatedRecipe = new Recipe();
        updatedRecipe.name = entity.name;
        updatedRecipe.type = entity.type;
        await queryRunner.manager
          .getRepository(Recipe)
          .update(entity.id, updatedRecipe);

        const compositions = this.extractCompositions(entity);
        await queryRunner.manager
          .getRepository(Composition)
          .delete({ recipe_id: updatedRecipe.id });
        const updatedCompositions = await queryRunner.manager
          .getRepository(Composition)
          .save(compositions);

        await queryRunner.commitTransaction();
        response.statusCode = HttpStatus.OK;
        response.message = updatedRecipe;
      } else throw new Error(`Recipe id ${entity.id} dosn't exist`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      switch (true) {
        case error instanceof QueryFailedError:
          response.statusCode = HttpStatus.NOT_FOUND;
          response.message = (error as QueryFailedError).driverError.detail;
          break;
        case error instanceof Error:
          response.statusCode = HttpStatus.BAD_REQUEST;
          response.message = (error as Error).message;
          break;
      }
    } finally {
      await queryRunner.release();
    }

    return response;
  }

  async deleteRecipe(id: number) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const { message: recipe } = await this.getRecipe(id);
      if (recipe instanceof Recipe) {
        await this.recipeRepository.delete(id);
        response.statusCode = HttpStatus.OK;
        response.message = id;
      } else throw new Error(`Recipe id ${id} dosn't exist`);
    } catch (error) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = (error as Error).message;
    }

    return response;
  }

  extractCompositions(entity: any) {
    const compositions: Composition[] = entity.ingredients?.map(
      (ingredient: any) => {
        const composition = new Composition();
        composition.recipe_id = entity.id;
        composition.ingredient_id = ingredient.id;
        composition.quantity = ingredient.quantity;
        if (composition.quantity < 0) {
          throw new Error(
            `Ingredient quantity (${composition.quantity}) must be a positive number`,
          );
        }
        return composition;
      },
    );
    return compositions;
  }

  extractRecipes(results: any) {
    const entities = new Map();
    (results as any[]).forEach((result) => {
      const ingredient = result.ingredient_id as Ingredient;
      const recipe = result.recipe_id as Recipe;

      !entities.has(recipe.id) && entities.set(recipe.id, {});
      const entity = entities.get(recipe.id);

      entity.id = recipe.id;
      entity.name = recipe.name;
      entity.type = recipe.type;
      !entity.ingredients && (entity.ingredients = []);
      entity.ingredients.push({
        ...ingredient,
        quantity: result.quantity,
      });
    });
    return Array.from(entities.values());
  }
}
