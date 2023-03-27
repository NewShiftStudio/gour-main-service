import {OrderPaymentMethod} from "../../../entity/Order";

export class LeadCreateDto {
  name: string;
  price: number;
  description: string;
  stateName: string;
  paymentMethod?: OrderPaymentMethod;
}
