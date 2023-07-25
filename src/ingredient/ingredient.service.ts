import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async getIngredients() {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    const ingredients = await this.ingredientRepository.find();
    response.statusCode = HttpStatus.OK;
    response.message = ingredients;

    return response;
  }

  async getIngredient(id: number) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const ingredient = await this.ingredientRepository.findOne({
        where: { id },
      });
      if (ingredient) {
        response.statusCode = HttpStatus.OK;
        response.message = ingredient;
      } else throw new Error(`Ingredient id ${id} dosn't exist`);
    } catch (error) {
      response.statusCode = HttpStatus.NOT_FOUND;
      response.message = (error as Error).message;
    }

    return response;
  }

  async createIngredient(entity: any) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const ingredient = new Ingredient();
      ingredient.name = entity.name;
      ingredient.aisle = entity.aisle;
      const createdIngredient = await this.ingredientRepository.save(
        ingredient,
      );
      response.statusCode = HttpStatus.CREATED;
      response.message = createdIngredient;
    } catch (error) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.message = (error as Error).message;
    }

    return response;
  }

  async updateIngredient(entity: any) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const { message: ingredient } = await this.getIngredient(entity.id);
      if (ingredient instanceof Ingredient) {
        await this.ingredientRepository.update(entity.id, entity);
        response.statusCode = HttpStatus.OK;
        response.message = entity;
      } else throw new Error(`Ingredient id ${entity.id} dosn't exist`);
    } catch (error) {
      response.statusCode = HttpStatus.NOT_FOUND;
      response.message = (error as Error).message;
    }

    return response;
  }

  async deleteIngredient(id: number) {
    const response = {
      statusCode: undefined,
      message: undefined,
    };

    try {
      const { message: ingredient } = await this.getIngredient(id);
      if (ingredient instanceof Ingredient) {
        await this.ingredientRepository.delete(id);
        response.statusCode = HttpStatus.OK;
        response.message = id;
      } else throw new Error(`Ingredient id ${id} dosn't exist`);
    } catch (error) {
      switch (true) {
        case error instanceof QueryFailedError:
          response.statusCode = HttpStatus.CONFLICT;
          response.message = (error as QueryFailedError).driverError.detail;
          break;
        case error instanceof Error:
          response.statusCode = HttpStatus.BAD_REQUEST;
          response.message = (error as Error).message;
          break;
      }
    }

    return response;
  }
}
