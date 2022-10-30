import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletChangeValueDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsUUID()
  walletUuid: string;
}
