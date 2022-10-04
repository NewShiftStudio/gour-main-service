import { MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from '../entity/Category';

const generateCategory = (
  title: string,
  parentCategories?: ReturnType<typeof generateCategory>[],
  subCategories?: ReturnType<typeof generateCategory>[],
) => ({
  title: {
    ru: title,
    en: title,
  },
  ...((parentCategories && { parentCategories }) || {}),
  ...((subCategories && { subCategories }) || {}),
});

export class SeedProductCategories2662982868825 implements MigrationInterface {
  name = 'SeedProductCategories2662982868865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const insertToCategoryTable = (
      rows: ReturnType<typeof generateCategory>[],
    ) => queryRunner.manager.save(Category, rows);

    const [cheeseCategory, meatCategory] = await insertToCategoryTable([
      generateCategory('Сыр'),
      generateCategory('Мясо'),
    ]);

    await insertToCategoryTable([
      // сыр
      generateCategory(
        'Молоко',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('Козье молоко'),
          generateCategory('Коровье молоко'),
          generateCategory('Овечье молоко'),
          generateCategory('Смешанное'),
        ]),
      ),
      generateCategory(
        'Категория сыра',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('Свежий'),
          generateCategory('Мягкий'),
          generateCategory('Полутвёрдый'),
          generateCategory('Твердые'),
          generateCategory('Голубой с плесенью'),
        ]),
      ),
      generateCategory(
        'Тип корочки',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('С белой плесенью'),
          generateCategory('Мытая'),
          generateCategory('Полутвёрдый'),
          generateCategory('Не указано'),
        ]),
      ),
      generateCategory(
        'Наличие сычужного фермента',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('Да'),
          generateCategory('Нет'),
        ]),
      ),
      generateCategory(
        'Страна происхождения',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('Испания'),
          generateCategory('Италия'),
          generateCategory('Франция'),
          generateCategory('Голландия'),
          generateCategory('Великобритания'),
          generateCategory('Россия'),
        ]),
      ),
      generateCategory(
        'Выдержка',
        [cheeseCategory],
        await insertToCategoryTable([
          generateCategory('Без выдержки'),
          generateCategory('От 1 месяца'),
          generateCategory('От 3 месяцев'),
          generateCategory('От 6 месяцев'),
          generateCategory('От 1 года'),
        ]),
      ),

      // мясо
      generateCategory(
        'Тип мяса',
        [meatCategory],
        await insertToCategoryTable([
          generateCategory('Говядина'),
          generateCategory('Свинина'),
          generateCategory('Овечье'),
          generateCategory('Козье'),
          generateCategory('Смешанный'),
        ]),
      ),
      generateCategory(
        'Тип мясного продукта',
        [meatCategory],
        await insertToCategoryTable([
          generateCategory('Колбаса'),
          generateCategory('Окорок'),
          generateCategory('Нарезка'),
          generateCategory('Другое'),
        ]),
      ),
      generateCategory(
        'Тип обработки',
        [meatCategory],
        await insertToCategoryTable([
          generateCategory('Варёное'),
          generateCategory('Горячего копчения'),
          generateCategory('Холодного копчения'),
          generateCategory('Вяленое'),
          generateCategory('Сыровяленое'),
        ]),
      ),
      generateCategory(
        'Страна происхождения',
        [meatCategory],
        await insertToCategoryTable([
          generateCategory('Испания'),
          generateCategory('Италия'),
          generateCategory('Франция'),
          generateCategory('Голландия'),
          generateCategory('Великобритания'),
          generateCategory('Россия'),
        ]),
      ),
      generateCategory(
        'Выдержка',
        [meatCategory],
        await insertToCategoryTable([
          generateCategory('Без выдержки'),
          generateCategory('От 1 месяца'),
          generateCategory('От 3 месяцев'),
          generateCategory('От 6 месяцев'),
          generateCategory('От 1 года'),
        ]),
      ),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
