import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderProductCreateDto } from './orderProduct.create.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class OrderCreateDto {
  @IsArray()
  @ValidateNested()
  @Type(() => OrderProductCreateDto)
  @ApiModelProperty({
    isArray: true,
    type: OrderProductCreateDto,
  })
  orderProducts: OrderProductCreateDto[];

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  orderProfileId: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  comment?: string;
}
