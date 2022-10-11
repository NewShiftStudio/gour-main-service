export type AbstractService = {
  increaseAmountOfProductById?(
    id: Id,
    amount: number,
  ): Promise<AbstractProduct>;

  decreaseAmountOfProductById?(
    id: Id,
    amount: number,
  ): Promise<AbstractProduct>;

  increaseWeightOfProductById?(
    id: Id,
    weight: number,
  ): Promise<AbstractProduct>;

  decreaseWeightOfProductById?(
    id: Id,
    weight: number,
  ): Promise<AbstractProduct>;

  deleteProductById?(id: Id): Promise<void>;

  deleteProductsById?(ids: Array<Id>): Promise<void>;

  getRestOfProductById?(id: string): Promise<AbstractStock>;

  watchForProductChanges?(): Promise<object | void>;

  getModificationsById?(): Promise<AbstractModification>;

  getProductById?(uuid: Id): Promise<AbstractProduct>;

  getStockOfProductByWarehouseIdCityNameAndGram?(
    id: Id,
    city: CityName,
    gram: number,
  ): Promise<AbstractStock>;
};

export type IWarehouseService<S extends AbstractService> = {
  [M in keyof AbstractService]: S[M];
};

export type AbstractProduct = {
  id: Uuid;
};

export type AbstractModification = {
  id: Uuid;
};

export type AbstractStock = {
  id: Uuid;
  value: StockInPiece;
};

export type AbstractStore = {
  id: Uuid;
  city: CityName;
};
