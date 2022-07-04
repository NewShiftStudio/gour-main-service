import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeCityDto {
  @ApiProperty()
  @IsNumber()
  cityId: number;
}
