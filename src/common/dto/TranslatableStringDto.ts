import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslatableStringDto {
  @Length(0, 255)
  @IsString()
  @ApiProperty()
  en: string;

  @Length(0, 255)
  @IsString()
  @ApiProperty()
  ru: string;
}
