import { Test, TestingModule } from '@nestjs/testing';
import { ReferralCodeController } from './referral-code.controller';

describe('ReferralCodeController', () => {
  let controller: ReferralCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralCodeController],
    }).compile();

    controller = module.get<ReferralCodeController>(ReferralCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
