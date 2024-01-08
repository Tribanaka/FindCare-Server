import { Test, TestingModule } from '@nestjs/testing';
import { PractionersController } from './practioners.controller';

describe('PractionersController', () => {
  let controller: PractionersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractionersController],
    }).compile();

    controller = module.get<PractionersController>(PractionersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
