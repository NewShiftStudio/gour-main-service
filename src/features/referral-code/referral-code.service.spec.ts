import { Test, TestingModule } from '@nestjs/testing';
import { ReferralCodeService } from './referral-code.service';

describe('ReferralCodeService', () => {
  let service: ReferralCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralCodeService],
    }).compile();

    service = module.get<ReferralCodeService>(ReferralCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
