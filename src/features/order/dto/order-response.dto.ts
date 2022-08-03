import { Order } from '../../../entity/Order';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

class CrmInfoStatus {
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
}

class CrmInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: CrmInfoStatus;
}

class OrderPromotionDescription {
  @ApiProperty()
  title: string;

  @ApiProperty()
  value: number;

  @ApiProperty({
    enum: ['cheeseCoin', 'percent'],
  })
  currency: 'cheeseCoin' | 'percent';
}

export class OrderResponseDto {
  @ApiModelProperty({
    type: () => Order,
  })
  order: Order;

  @ApiModelProperty({
    type: () => CrmInfoDto,
  })
  crmInfo: CrmInfoDto;

  @ApiProperty({
    isArray: true,
    type: () => OrderPromotionDescription,
  })
  promotions: OrderPromotionDescription[];
}
