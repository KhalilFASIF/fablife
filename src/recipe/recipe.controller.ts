import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.entity';

@Controller('recipes')
export class RecipeController {
  constructor(private recipesService: RecipeService) {}

  @Post()
  createIngredient(@Body() recipe: Recipe) {
    return this.recipesService.createRecipe(recipe);
  }

  @Delete(':id')
  deleteIngredient(@Param() params: any) {
    return this.recipesService.deleteRecipe(params.id);
  }

  @Get()
  getIngredients() {
    return this.recipesService.getRecipes();
  }

  @Get(':id')
  getIngredient(@Param() params: any) {
    return this.recipesService.getRecipe(params.id);
  }

  @Put()
  updateIngredient(@Body() recipe: Recipe) {
    return this.recipesService.updateRecipe(recipe);
  }
}
