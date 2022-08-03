import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @Length(0, 500)
  @IsString()
  @ApiProperty()
  small: string;

  @Length(0, 500)
  @IsString()
  @ApiProperty()
  full: string;
}
