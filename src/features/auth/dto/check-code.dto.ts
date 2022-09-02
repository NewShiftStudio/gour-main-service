import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckCodeDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  codeHash: string;
}
