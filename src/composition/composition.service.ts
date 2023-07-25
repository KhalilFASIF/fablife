import { Injectable } from '@nestjs/common';
import { Composition } from './composition.entity';

@Injectable()
export class CompositionService {
  getCompositions(entity: any) {
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
}
