export type ApiResponse<T> = Promise<T>;

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
};

export type MoyskladStore = {
  rows: {
    id: Uuid;
    addressFull: {
      city: CityName;
    };
  }[];
};
