import { Category } from 'src/entity/Category';

type CategoryWithDiscounts = {
  id: number;
  title: { en: string; ru: string };
  subCategories: {
    id: number;
    title: { en: string; ru: string };
    discountPrice: number;
  }[];
};

export function getUniqueCategoriesWithDiscounts(categoriesList: Category[]) {
  const categoriesObj = categoriesList.reduce<
    Record<string, CategoryWithDiscounts>
  >((acc, category) => {
    const key = category.title.ru;
    const hasAlreadyCategory = !!acc[key];

    if (!hasAlreadyCategory) {
      acc[key] = formatCategoryWithDiscount(category);
    } else {
      for (const subCategory of category.subCategories) {
        const expectedSubCategory = acc[key].subCategories.find(
          (it) => it.title.ru === subCategory.title.ru,
        );

        if (expectedSubCategory) {
          expectedSubCategory.discountPrice += subCategory.discounts[0].price;
        } else {
          acc[key].subCategories.push(
            formatSubCategoryWithDiscount(subCategory),
          );
        }
      }
    }

    return acc;
  }, {});

  return Object.values(categoriesObj);
}

function formatCategoryWithDiscount(category: Category): CategoryWithDiscounts {
  return {
    id: category.id,
    title: category.title,
    subCategories: category.subCategories.map(formatSubCategoryWithDiscount),
  };
}

function formatSubCategoryWithDiscount(subCategory: Category) {
  return {
    id: subCategory.id,
    title: subCategory.title,
    discountPrice: subCategory.discounts[0].price,
  };
}
