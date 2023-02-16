import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VolumeDto {
  @IsString()
  @ApiProperty()
  clientName: string;

  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  amount: number;

  @IsString()
  @ApiProperty()
  clientId: string;
}
