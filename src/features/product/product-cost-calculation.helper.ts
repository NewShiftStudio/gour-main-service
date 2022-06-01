import {
  ProductPromotion,
  ProductWithFullCostDto,
} from './dto/product-with-full-cost.dto';

interface MinimumProduct {
  id: number;
  price: {
    cheeseCoin: number;
  };
}

interface MinimumPromotion {
  discount: number;
  products: { id: number }[];
}

interface MinimumClient {
  referralCode?: {
    discount: number;
  };
}

export type ProductWithFullCost<P> = P & {
  promotions: ProductPromotion[];
  totalCost: number;
};

export function getProductsWithFullCost<P extends MinimumProduct>(
  products: P[],
  allPromotions: MinimumPromotion[],
  client: MinimumClient,
): ProductWithFullCost<P>[] {
  const promotionsByProductId = getPromotionsValueByProductId(
    products,
    allPromotions,
  );

  const productsWithFullCost: ProductWithFullCost<P>[] = [];

  const basePromotions: ProductPromotion[] = [];

  if (client.referralCode) {
    basePromotions.push({
      title: 'Скидка за реферальный код',
      value: client.referralCode.discount,
    });
  }

  for (const product of products) {
    const promotions = [...basePromotions];
    if (promotionsByProductId[product.id]) {
      promotions.push({
        title: 'Скидка за акцию',
        value: promotionsByProductId[product.id],
      });
    }

    const totalDiscount = promotions.reduce((acc, it) => acc + it.value, 0);

    const totalCost = product.price.cheeseCoin * (1 - totalDiscount / 100);
    productsWithFullCost.push({
      ...product,
      promotions,
      totalCost,
    });
  }

  return productsWithFullCost;
}

export function getPromotionsValueByProductId(
  products: MinimumProduct[],
  promotions: MinimumPromotion[],
): Record<number, number> {
  const promotionsByProductId: Record<number, number> = products.reduce(
    (acc, it) => {
      acc[it.id] = 0;
      return acc;
    },
    {},
  );

  for (const promotion of promotions) {
    for (const promotionProduct of promotion.products) {
      if (
        promotionProduct.id in promotionsByProductId &&
        promotionsByProductId[promotionProduct.id] < promotion.discount
      ) {
        promotionsByProductId[promotionProduct.id] = promotion.discount;
      }
    }
  }

  return promotionsByProductId;
}
