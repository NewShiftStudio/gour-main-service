import { Test, TestingModule } from '@nestjs/testing';
import { OrderProfileController } from './order-profile.controller';

describe('OrderProfileController', () => {
  let controller: OrderProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderProfileController],
    }).compile();

    controller = module.get<OrderProfileController>(OrderProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
