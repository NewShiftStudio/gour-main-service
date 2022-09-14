import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, IsNull, Repository } from 'typeorm';
import { Category } from '../../entity/Category';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findMany(params: BaseGetListDto) {
    const options: FindManyOptions<Category> = {
      ...getPaginationOptions(params.offset, params.length),
    };

    const result = await this.categoryRepository.findAndCount({
      ...options, // FIXME: сломана пагинация из-за фильтра массива
      relations: [
        'parentCategories',
        'subCategories',
        'subCategories.subCategories',
      ],
      where: {
        // parentCategories: IsNull(),
        // parentCategories: {
        // id: IsNull(),
        // },
      }, // FIXME: все джойнится, но не могу добавить условие
      //
    });

    // return (
    //   this.categoryRepository
    //     .createQueryBuilder('category')
    //     .leftJoinAndSelect('category.parentCategories', 'parentCategories')
    //     .leftJoinAndSelect('category.subCategories', 'subCategories')
    //     .leftJoinAndSelect('category.title', 'title')
    //     // .leftJoinAndSelect('category.subCategories.title', 'title')
    //     // .leftJoinAndSelect(
    //     //   'category.subCategories.subCategories',
    //     //   'subCategories',
    //     // )
    //     .where('parentCategories.id IS NULL', { id: null })
    //     .skip(options.skip)
    //     .take(options.take)
    //     .getManyAndCount()
    // ); // FIXME: достаются категории, но не могу достать дочерние элементы 3 уровня (title и subCategories)

    return [
      // result[0],
      result[0].filter((category) => !category.parentCategories?.length), // FIXME: с этим условием некорректно работает пагинация, только вручную писать ее
      result[1],
    ];
  }

  async getOne(id: number) {
    try {
      return await this.categoryRepository.findOneOrFail({ id });
    } catch {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async create(dto: CategoryCreateDto) {
    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: CategoryUpdateDto) {
    const isNotExist = !(await this.getOne(id));

    if (isNotExist) throw new NotFoundException('Категория не найдена');

    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save({
      ...category,
      id,
    });
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
