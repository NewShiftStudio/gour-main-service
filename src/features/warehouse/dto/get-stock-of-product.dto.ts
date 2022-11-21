import { IsString, IsUUID } from 'class-validator';

export class GetStockOfProductDto {
  @IsString()
  gram: GramsInString;

  @IsString()
  city: CityName;

  @IsUUID()
  warehouseId: Uuid;
}
