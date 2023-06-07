import {OrderPaymentMethod} from "../../../entity/Order";

export class LeadCreateDto {
  name: string;
  price: number;
  description: string;
  stateName: string;
  paymentMethod?: OrderPaymentMethod;
  moyskladOrderId: Uuid;
  isClientIndividual: boolean;
  email: string;
  address: string;
  phone: string;
  userName: string;
}
