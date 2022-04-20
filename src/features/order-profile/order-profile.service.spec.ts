import { Test, TestingModule } from '@nestjs/testing';
import { OrderProfileService } from './order-profile.service';

describe('OrderProfileService', () => {
  let service: OrderProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProfileService],
    }).compile();

    service = module.get<OrderProfileService>(OrderProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
