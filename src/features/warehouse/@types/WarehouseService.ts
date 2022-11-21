import { CreateWarehouseAgentDto } from '../dto/create-agent.dto';
import { ModificationDto } from '../dto/modification.dto';

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

  getAuthorizationToken?<S extends AuthStrategy>(
    data: StrategyData[S],
    strategy: S,
  ): Promise<Token>;

  createOrder(
    assortment: AbstractAssortment[],
    meta: object,
  ): Promise<AbstractOrder>;

  createWarehouseAgent(agent: CreateWarehouseAgentDto): Promise<AbstractAgent>;
};

export enum AuthStrategy {
  BASIC_AUTH = 'BASIC_AUTH',
}

export type StrategyData = {
  [AuthStrategy.BASIC_AUTH]: {
    login: string;
    password: string;
  };
};

export type IWarehouseService<S extends AbstractService> = {
  [M in keyof AbstractService]: S[M];
};

export type AbstractAssortment = {
  id: Uuid;
  productId: Uuid;
  price: AmountInCents;
  quantity: Piece;
  discount: Percent;
  gram: number;
  type: 'variant' | 'product';
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

export type AbstractOrder = {
  id: Uuid;
};

export type AbstractAgent = {
  id: Uuid;
};
