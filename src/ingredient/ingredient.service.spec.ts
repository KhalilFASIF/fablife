import { Test, TestingModule } from '@nestjs/testing';
import { IngredientService } from './ingredient.service';

describe('IngredientsService', () => {
  let service: IngredientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientService],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
