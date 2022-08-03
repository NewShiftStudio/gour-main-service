import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CityCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  name: TranslatableStringDto;
}
