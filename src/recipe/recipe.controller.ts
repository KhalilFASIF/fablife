import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private recipesService: RecipeService) {}

  @Get()
  async getRecipes(@Res() res: any) {
    const response = await this.recipesService.getRecipes();
    res.status(response.statusCode).json(response.message);
  }

  @Get(':id')
  async getRecipe(@Param() params: any, @Res() res: any) {
    const response = await this.recipesService.getRecipe(params.id);
    res.status(response.statusCode).json(response.message);
  }

  @Post()
  async createRecipe(@Body() body: any, @Res() res: any) {
    const response = await this.recipesService.createRecipe(body);
    res.status(response.statusCode).json(response.message);
  }

  @Put()
  async updateRecipe(@Body() body: any, @Res() res: any) {
    const response = await this.recipesService.updateRecipe(body);
    res.status(response.statusCode).json(response.message);
  }

  @Delete(':id')
  async deleteRecipe(@Param() params: any, @Res() res: any) {
    const response = await this.recipesService.deleteRecipe(params.id);
    res.status(response.statusCode).json(response.message);
  }
}
