import { MoyskladEvent } from 'src/features/warehouse/@types/Moysklad';

export class UpdateOrderStatusDto {
  events: MoyskladEvent[];
}
