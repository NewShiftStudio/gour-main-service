import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletChangeValueDto {
  @ApiProperty()
  @IsNumber()
  value: number;
}
