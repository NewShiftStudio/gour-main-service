import { ClientRole } from 'src/entity/ClientRole';
import { RoleDiscount } from 'src/entity/RoleDiscount';

interface MinimumProduct {
  id: number;
  price: {
    cheeseCoin: number;
  };
  discount: number;
  roleDiscounts: RoleDiscount[];
}

interface MinimumPromotion {
  discount: number;
  products: { id: number }[];
}

export type ProductWithTotalCost<P> = P & {
  totalCost: number;
};

export function getProductsWithDiscount<P extends MinimumProduct>(
  products: P[],
  allPromotions: MinimumPromotion[],
  role: ClientRole,
): ProductWithTotalCost<P>[] {
  const promotionsByProductId = getPromotionsValueByProductId(
    products,
    allPromotions,
  );

  const productsWithDiscount = products.map((product) => {
    // для физ. лица действуют скидки акций, для прочих есть их ролевая цена
    if (role.key === 'individual') {
      const promotionDiscountPercent = promotionsByProductId[product.id];

      product.discount = promotionDiscountPercent;
    } else {
      const roleDiscount = product.roleDiscounts.find(
        (roleDiscount) => roleDiscount.role.id === role.id,
      );

      if (roleDiscount) {
        const priceWithRoleDiscount = Math.ceil(
          product.price.cheeseCoin - roleDiscount.value,
        );

        product.price.cheeseCoin = priceWithRoleDiscount;
      }
    }

    const totalCost = Math.ceil(
      product.price.cheeseCoin * (1 - product.discount / 100),
    );

    return { ...product, totalCost };
  });

  return productsWithDiscount;
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
