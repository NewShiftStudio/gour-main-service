export class ModificationDto {
  productId: Uuid;
  price: AmountInCents;
  gram: WeightInGrams;
  quantity: Piece;
  discount: Percent;
  type: 'variant' | 'product';
}
