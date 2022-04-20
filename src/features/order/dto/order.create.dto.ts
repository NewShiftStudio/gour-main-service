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
import {
  ApiModelProperty,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class OrderCreateDto {
  @IsArray()
  @ValidateNested()
  @Type(() => OrderProductCreateDto)
  @ApiModelProperty({
    isArray: true,
    type: OrderProductCreateDto,
  })
  orderProducts: OrderProductCreateDto[];

  // @IsOptional()
  // @IsNumber()
  // @ApiPropertyOptional()
  // orderProfile: number;

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

  @IsNumber()
  @ApiProperty()
  cityId: number;

  @IsString()
  @ApiProperty()
  deliveryType: string;

  @IsString()
  @ApiProperty()
  address: string;
}
