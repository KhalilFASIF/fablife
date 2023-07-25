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

import { IngredientService } from './ingredient.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  async getIngredients(@Res() res: any) {
    const response = await this.ingredientService.getIngredients();
    res.status(response.statusCode).json(response.message);
  }

  @Get(':id')
  async getIngredient(@Param() params: any, @Res() res: any) {
    const response = await this.ingredientService.getIngredient(params.id);
    res.status(response.statusCode).json(response.message);
  }

  @Post()
  async createIngredient(@Body() body: any, @Res() res: any) {
    const response = await this.ingredientService.createIngredient(body);
    res.status(response.statusCode).json(response.message);
  }

  @Put()
  async updateIngredient(@Body() body: any, @Res() res: any) {
    const response = await this.ingredientService.updateIngredient(body);
    res.status(response.statusCode).json(response.message);
  }

  @Delete(':id')
  async deleteIngredient(@Param() params: any, @Res() res: any) {
    const response = await this.ingredientService.deleteIngredient(params.id);
    res.status(response.statusCode).json(response.message);
  }
}
