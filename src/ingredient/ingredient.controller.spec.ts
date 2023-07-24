import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsController } from './ingredient.controller';

describe('IngredientsController', () => {
  let controller: IngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
