import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CityUpdateDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  name: TranslatableStringDto;

  @IsNumber()
  @IsOptional()
  deliveryCost: number;
}
