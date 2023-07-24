import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Ingredient } from './ingredient/ingredient.entity';
import { IngredientsController } from './ingredient/ingredient.controller';
import { IngredientService } from './ingredient/ingredient.service';
import { Recipe } from './recipe/recipe.entity';
import { RecipeController } from './recipe/recipe.controller';
import { RecipeService } from './recipe/recipe.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Ingredient, Recipe],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Ingredient, Recipe]),
  ],
  controllers: [AppController, IngredientsController, RecipeController],
  providers: [AppService, IngredientService, RecipeService],
})
export class AppModule {}
