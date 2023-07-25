import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Composition } from './composition/composition.entity';
import { CompositionController } from './composition/composition.controller';
import { CompositionService } from './composition/composition.service';
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
      entities: [Composition, Ingredient, Recipe],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Composition, Ingredient, Recipe]),
  ],
  controllers: [
    AppController,
    CompositionController,
    IngredientsController,
    RecipeController,
  ],
  providers: [AppService, CompositionService, IngredientService, RecipeService],
})
export class AppModule {}
