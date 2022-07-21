import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductGradeUpdateDto {
  @IsBoolean()
  @ApiProperty()
  isApproved: boolean;
}
