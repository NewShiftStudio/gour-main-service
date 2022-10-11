import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetStockOfProductDto } from './dto/get-stock-of-product.dto';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @MessagePattern('get-stock-of-product')
  getStockOfProductByWarehouseIdCityNameAndGram(
    @Payload() dto: GetStockOfProductDto,
  ) {
    return this.warehouseService.getStockOfProductByWarehouseIdCityNameAndGram(
      dto.warehouseId,
      dto.city,
      +dto.gram,
    );
  }
}
