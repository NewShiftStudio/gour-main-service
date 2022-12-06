import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderProductCreateDto } from './order-product-create.dto';
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

  @IsNumber()
  @ApiProperty()
  deliveryProfileId: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  promoCodeId?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  comment?: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
