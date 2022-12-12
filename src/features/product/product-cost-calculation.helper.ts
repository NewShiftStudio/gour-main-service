import { ClientRole } from 'src/entity/ClientRole';
import { Product } from 'src/entity/Product';
import { arrayToDictionary } from 'src/utils/common';
import { CategoryWithDiscounts } from '../category/category.helpers';

const MAXIMAL_EATING_DISCOUNT = 10;

interface MinimumProduct {
  id: number;
  price: {
    cheeseCoin: number;
  };
  discount: number;
  roleDiscounts: Product['roleDiscounts'];
  categories: Product['categories'];
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
  allCategoriesWithDiscounts: CategoryWithDiscounts[],
): ProductWithTotalCost<P>[] {
  const promotionsByProductId = getPromotionsValueByProductId(
    products,
    allPromotions,
  );

  const categoriesDictionary = getCategoriesDictionary(
    allCategoriesWithDiscounts,
  );

  const productsWithDiscount = products.map((product) => {
    const eatingDiscountInPercent = calcEatingDiscount(
      product,
      categoriesDictionary,
    );

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

    product.discount += eatingDiscountInPercent;
    if (product.discount > 1) {
      // TODO: уточнить, может ли быть скидка около 0.9 по промоакции?
      product.discount = 1;
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

function getCategoriesDictionary(categories: CategoryWithDiscounts[]) {
  const flattedCategories = categories.reduce(
    (acc, midCategory) => [...acc, ...midCategory.subCategories],
    [] as CategoryWithDiscounts['subCategories'],
  );
  return arrayToDictionary(flattedCategories);
}

function calcEatingDiscount(
  product: MinimumProduct,
  categoriesDictionary: ReturnType<typeof getCategoriesDictionary>,
) {
  const productCategoriesIds = product.categories?.map(({ id }) => id);

  const maxCategoryWithDiscount = productCategoriesIds?.reduce(
    (maxDiscount, categoryId) => {
      const category = categoriesDictionary[categoryId];

      if (!category || maxDiscount > category.discountPrice) return maxDiscount;
      return category.discountPrice;
    },
    0,
  );

  const eatingDiscountInPercent = Math.floor(maxCategoryWithDiscount / 100_000);

  if (eatingDiscountInPercent > MAXIMAL_EATING_DISCOUNT) {
    return MAXIMAL_EATING_DISCOUNT;
  }
  return eatingDiscountInPercent;
}
