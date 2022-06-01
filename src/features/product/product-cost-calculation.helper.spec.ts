import { ProductService } from './product.service';
import {
  getProductsWithFullCost,
  getPromotionsValueByProductId,
} from './product-cost-calculation.helper';

const testProduct1 = {
  id: 1,
  price: {
    cheeseCoin: 1000,
  },
};

describe('Тестирование функции getProductsWithFullCost', () => {
  test('Проверка правильности подсчета стоимости с реферральной скидкой', () => {
    const result = getProductsWithFullCost([testProduct1], [], {
      referralCode: {
        discount: 10,
      },
    });

    expect(result[0].promotions[0]).toEqual({
      title: 'Скидка за реферальный код',
      value: 10,
    });
    expect(result[0].totalCost).toBe(900);
  });

  test('Проверка правильности подсчета стоимости со скидкой акции', () => {
    const result = getProductsWithFullCost(
      [testProduct1],
      [
        {
          discount: 20,
          products: [testProduct1],
        },
      ],
      {},
    );

    expect(result[0].promotions[0]).toEqual({
      title: 'Скидка за акцию',
      value: 20,
    });
    expect(result[0].totalCost).toBe(800);
  });

  test('Проверка правильности подсчета стоимости со скидкой акции и реферального кода', () => {
    const result = getProductsWithFullCost(
      [testProduct1],
      [
        {
          discount: 20,
          products: [testProduct1],
        },
      ],
      {
        referralCode: {
          discount: 10,
        },
      },
    );

    expect(result[0].promotions).toEqual([
      {
        title: 'Скидка за реферальный код',
        value: 10,
      },
      {
        title: 'Скидка за акцию',
        value: 20,
      },
    ]);
    expect(result[0].totalCost).toBe(700);
  });
});

describe('Тестирование функции getPromotionsValueByProductId', () => {
  test('проверка с одной акцией', () => {
    const result = getPromotionsValueByProductId(
      [testProduct1],
      [
        {
          products: [testProduct1],
          discount: 10,
        },
      ],
    );

    expect(result[testProduct1.id]).toBe(10);
  });
  test('Проверка с несколькими акциями', () => {
    const result = getPromotionsValueByProductId(
      [testProduct1],
      [
        {
          products: [testProduct1],
          discount: 10,
        },
        {
          products: [testProduct1],
          discount: 25,
        },
        {
          products: [testProduct1],
          discount: 5,
        },
      ],
    );

    expect(result[testProduct1.id]).toBe(25);
  });
});
