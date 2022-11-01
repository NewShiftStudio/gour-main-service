import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletChangeValueDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @IsString()
  description: string;

  @ApiProperty()
  @IsUUID()
  walletUuid: string;
}
