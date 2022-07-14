import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslatableTextDto {
  @IsString()
  @ApiProperty()
  en: string;

  @IsString()
  @ApiProperty()
  ru: string;
}
