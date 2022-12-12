import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PromoCodeCheckDto {
  @ApiProperty()
  @IsString()
  key: string;
}
