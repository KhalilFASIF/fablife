import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient.entity';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientService: IngredientService) {}

  @Post()
  createIngredient(@Body() ingredient: Ingredient) {
    return this.ingredientService.createIngredient(ingredient);
  }

  @Delete(':id')
  deleteIngredient(@Param() params: any) {
    return this.ingredientService.deleteIngredient(params.id);
  }

  @Get()
  getIngredients() {
    return this.ingredientService.getIngredients();
  }

  @Get(':id')
  getIngredient(@Param() params: any) {
    return this.ingredientService.getIngredient(params.id);
  }

  @Put()
  updateIngredient(@Body() ingredient: Ingredient) {
    return this.ingredientService.updateIngredient(ingredient);
  }
}
