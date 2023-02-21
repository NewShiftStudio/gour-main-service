export type ApiResponse<T> = Promise<T>;

export class MoyskladEvent {
  meta: MoyskladMeta;
  action: string;
  accountId: string;
}

export class MoyskladMeta {
  type: string;
  href: string;
}

export type MoyskladWebhook = {
  id: Uuid;
  entityType: string;
  url: string;
  method: string;
  action: string;
};

export type MoyskladProduct = {
  id: Uuid;
};

export type MoyskladAssortment = {
  id: Uuid;
};

export type MoyskladModification = {
  rows: {
    id: Uuid;
    characteristics: {
      value: GramsInString;
    }[];
  }[];
};

export type MoyskladStock = {
  assortmentId: Uuid;
  stock: StockInPiece;
  reserve: number;
};

export type MoyskladStore = {
  rows: {
    id: Uuid;
    addressFull: {
      city: CityName;
    };
  }[];
};

export type MoyskladAuth = {
  access_token: Token;
};

export type MoyskladState = {
  meta: MoyskladMeta;
  id: string;
  name: string;
};

export type MoyskladMetadata = {
  states: MoyskladState[];
};

export type MoyskladOrder = {
  id: Uuid;
  name: string;
  state: MoyskladState;
  sum: number;
};

export type MoyskladAgent = {
  id: Uuid;
};

export type CreateOrderMeta = {
  organizationId: Uuid;
  counterpartyId?: Uuid;
  postalCode: string;
  addInfo: string;
  firstName: string;
  lastName: string;
  apartment: string;
  house: string;
  city: string;
  street: string;
  comment: string;
};
