import { ClientRole } from 'src/entity/ClientRole';
import { Product } from 'src/entity/Product';
import { arrayToDictionary } from 'src/utils/common';
import { CategoryWithDiscounts } from '../category/category.helpers';
import {Price} from "../../entity/Price";

const MAXIMAL_EATING_DISCOUNT = 10;

interface MinimumProduct {
  id: number;
  price: Price;
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

export function getProductPriceByRole(price: Price,role?: ClientRole,isCash = false) {
  if (!role || role.key === 'individual') {
    return price.individual;
  }

  return isCash ? price.companyByCash : price.company;
}

export function getProductsWithDiscount<P extends MinimumProduct>(
  products: P[],
  allPromotions: MinimumPromotion[],
  role: ClientRole|undefined,
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
    const eatingDiscountInPercent = role === undefined ? 0 : calcEatingDiscount(
      product,
      categoriesDictionary,
      role,
    );

    // для физ. лица действуют скидки акций, для прочих есть их ролевая цена
    if (role === undefined || role.key === 'individual') {
      const promotionDiscountPercent = promotionsByProductId[product.id];

      product.discount = promotionDiscountPercent;
    }

    product.discount += eatingDiscountInPercent;
    if (product.discount > 1) {
      product.discount = 1;
    }

    const totalCost = Math.ceil(
        getProductPriceByRole(product.price,role)  * (1 - product.discount / 100),
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

const CLIENT_ROLE_KEY = 'individual';

function calcEatingDiscount(
  product: MinimumProduct,
  categoriesDictionary: ReturnType<typeof getCategoriesDictionary>,
  role: ClientRole,
) {
  if (!product.categories || role.key !== CLIENT_ROLE_KEY) return 0;

  const productCategoriesIds = product.categories.map(({ id }) => id);

  const maxCategoryWithDiscount = productCategoriesIds.reduce(
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
