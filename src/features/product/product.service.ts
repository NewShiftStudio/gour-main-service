import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';

import { getProductsWithDiscount } from './product-cost-calculation.helper';
import { Product } from '../../entity/Product';
import { ProductCreateDto } from './dto/product-create.dto';
import { Category } from '../../entity/Category';
import { ProductUpdateDto } from './dto/product-update.dto';
import { RoleDiscount } from '../../entity/RoleDiscount';
import { ProductGetListDto } from './dto/product-get-list.dto';
import { ProductGetOneDto } from './dto/product-get-one.dto';
import { ClientRole } from '../../entity/ClientRole';
import { ProductGrade } from '../../entity/ProductGrade';
import { ProductWithMetricsDto } from './dto/product-with-metrics.dto';
import { Image } from '../../entity/Image';
import { Client } from '../../entity/Client';
import { Promotion } from '../../entity/Promotion';
import { ProductGetSimilarDto } from './dto/product-get-similar.dto';
import { CategoryService } from '../category/category.service';
import { ExportDto } from 'src/common/dto/export.dto';

@Injectable()
export class ProductService {
  constructor(
    private categoryService: CategoryService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductGrade)
    private productGradeRepository: Repository<ProductGrade>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(RoleDiscount)
    private roleDiscountRepository: Repository<RoleDiscount>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async findMany(
    params: ProductGetListDto,
    client: Client,
    dto?: ExportDto,
  ): Promise<[Product[], number]> {
    const options: FindManyOptions<Product> = {
      relations: [
        params.withSimilarProducts ? 'similarProducts' : undefined,
        params.withMeta ? 'meta' : undefined,
        params.withRoleDiscounts ? 'roleDiscounts' : undefined,
        params.withCategories || params.withDiscount ? 'categories' : undefined,
        'images',
      ].filter((it) => it),
    };

    let products = await this.productRepository.find(options);

    if (!products) throw new NotFoundException('Товары не найдены');

    const startDate = dto?.start && new Date(dto.start);
    const endDate = dto?.end && new Date(dto.end);

    const sliceStart = params?.offset && Number(params.offset);
    const sliceEnd = params?.length && sliceStart + Number(params.length);

    if (startDate || endDate) {
      products = products.filter((product) => {
        const isStartMatches = startDate
          ? startDate <= product.createdAt
          : true;
        const isEndMatches = endDate ? endDate >= product.createdAt : true;

        return isStartMatches && isEndMatches;
      });

      if (!products.length)
        throw new NotFoundException('Товары за указанный период не найдены');
    }

    if (sliceStart || sliceEnd) {
      products = products.slice(sliceStart, sliceEnd);
    }

    if (params.withDiscount) {
      products = await this.prepareProducts(client, products);
    }

    return [products, products.length];
  }

  async findNovelties(params: ProductGetListDto, client: Client) {
    // eslint-disable-next-line prefer-const
    let products = await this.productRepository.find({
      order: {
        id: 'DESC',
      },
      take: 10,
      relations: [
        params.withSimilarProducts && 'similarProducts',
        (params.withCategories || params.withDiscount) && 'categories',
        params.withMeta && 'meta',
        params.withRoleDiscounts && 'roleDiscounts',
      ].filter((it) => it),
    });

    if (params.withDiscount) {
      products = await this.prepareProducts(client, products);
    }

    return products;
  }

  async getSimilar(params: ProductGetSimilarDto, client: Client) {
    const productIds = params.productIds.split(',');

    // eslint-disable-next-line prefer-const
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
      relations: ['similarProducts'],
    });

    const similarProducts: Product[] = [];

    for (const product of products) {
      if (!product.similarProducts) return;

      for (const similar of product.similarProducts) {
        const isAlreadyHaveInBasket = products.find(
          (it) => it.id === similar.id,
        );
        const isAlreadyHaveInSelection = similarProducts.find(
          (it) => it.id === similar.id,
        );

        if (!isAlreadyHaveInBasket && !isAlreadyHaveInSelection)
          similarProducts.push(similar);
      }
    }

    const fullSimilarProducts = await this.prepareProducts(
      client,
      similarProducts,
    );

    return fullSimilarProducts;
  }

  async getOne(
    id: number,
    params: ProductGetOneDto,
    client: Client,
  ): Promise<ProductWithMetricsDto> {
    let product: ProductWithMetricsDto = await this.productRepository.findOne(
      id,
      {
        relations: [
          params.withSimilarProducts && 'similarProducts',
          params.withSimilarProducts && 'similarProducts.categories',
          params.withMeta && 'meta',
          params.withRoleDiscounts && 'roleDiscounts',
          params.withGrades && 'productGrades',
          params.withCategories && 'categories',
          params.withCategories && 'categories.parentCategories',
        ].filter((it) => it),
      },
    );

    if (!product) throw new NotFoundException('Товар не найден');

    if (params.withDiscount) {
      product = await this.prepareProduct(client, product);
    }

    if (params.withMetrics) {
      const grades = await this.productGradeRepository.find({
        product: { id },
        isApproved: true,
      });

      product = {
        ...product,
        gradesCount: grades.length,
        commentsCount: grades.filter((it) => it.comment && it.isApproved)
          .length,
      };
    }

    return product;
  }

  async create(dto: ProductCreateDto) {
    const saveParams: Omit<
      ProductCreateDto,
      'category' | 'similarProducts' | 'roleDiscounts' | 'images' | 'categories'
    > & {
      categories?: Category[];
      similarProducts?: (Product | number)[];
      roleDiscounts?: (RoleDiscount | object)[];
      images?: (Image | number)[];
    } = dto;

    if (dto.categoryIds) {
      saveParams.categories = [];

      for (const categoryId of dto.categoryIds) {
        const category = await this.categoryRepository.findOne(categoryId);

        saveParams.categories.push(category);
      }
    }

    if (dto.similarProducts) {
      saveParams.similarProducts = [];

      for (const productId of dto.similarProducts) {
        const similarProduct = await this.productRepository.findOne(productId);

        saveParams.similarProducts.push(similarProduct);
      }
    }

    if (dto.roleDiscounts) {
      saveParams.roleDiscounts = [];

      for (const { role: roleId, value } of dto.roleDiscounts) {
        const role = await this.clientRoleRepository.findOne(roleId);

        const roleDiscount = await this.roleDiscountRepository.findOne({
          role,
          value,
        });

        if (!roleDiscount) {
          const newRoleDiscount = await this.roleDiscountRepository.save({
            role,
            value,
          });

          saveParams.roleDiscounts.push(newRoleDiscount);

          return;
        }

        saveParams.roleDiscounts.push(roleDiscount);
      }
    }

    const images: Image[] = [];

    for (const imageId of dto.images) {
      const image = await this.imageRepository.findOne(imageId);

      if (!image)
        throw new NotFoundException(`Изображение с id=${imageId} не найдено`);

      images.push(image);
    }

    saveParams.images = images;

    return this.productRepository.save(saveParams as DeepPartial<Product>);
  }

  async update(id: number, dto: ProductUpdateDto) {
    const images: Image[] = [];

    if (dto.images) {
      for (const imageId of dto.images) {
        const image = await this.imageRepository.findOne(imageId);

        if (!image)
          throw new NotFoundException(`Изображение с id=${imageId} не найдено`);

        images.push(image);
      }
    }

    const saveParams: DeepPartial<Product> = {
      id,
      title: dto.title,
      description: dto.description,
      moyskladId: dto.moyskladId,
      images,
      price: dto.price,
      meta: dto.meta,
    };

    if (dto.categoryIds) {
      saveParams.categories = [];

      for (const categoryId of dto.categoryIds) {
        const category = await this.categoryRepository.findOne(categoryId);

        saveParams.categories.push(category);
      }
    }

    if (dto.similarProducts) {
      saveParams.similarProducts = [];

      for (const productId of dto.similarProducts) {
        const similarProduct = await this.productRepository.findOne(productId);

        saveParams.similarProducts.push(similarProduct);
      }
    }

    if (dto.roleDiscounts) {
      saveParams.roleDiscounts = [];

      for (const { role: roleId, value } of dto.roleDiscounts) {
        const role = await this.clientRoleRepository.findOne(roleId);

        const roleDiscount = await this.roleDiscountRepository.findOne({
          role,
          value,
        });

        if (!roleDiscount) {
          const newRoleDiscount = await this.roleDiscountRepository.save({
            role,
            value,
          });

          saveParams.roleDiscounts.push(newRoleDiscount);

          return;
        }

        saveParams.roleDiscounts.push(roleDiscount);
      }
    }

    return this.productRepository.save(saveParams);
  }

  async remove(id: number, hard = false) {
    if (hard) {
      const product = await this.productRepository.findOne(id);

      await this.roleDiscountRepository.delete({
        product,
      });

      return this.productRepository.delete(id);
    }

    return this.productRepository.softDelete(id);
  }

  async prepareProducts<P extends Product>(client: Client, products: P[]) {
    const now = new Date();

    const promotions = await this.promotionRepository.find({
      where: {
        start: LessThan(now),
        end: MoreThan(now),
      },
      relations: ['products'],
    });

    const categoriesWithDiscounts =
      await this.categoryService.findCategoriesWithDiscounts(client); // категории для системы наеденности

    const fullClient = await this.clientRepository.findOne(client.id);

    const productsWithDiscount = getProductsWithDiscount(
      products,
      promotions,
      fullClient.role,
      categoriesWithDiscounts,
    );

    return productsWithDiscount;
  }

  async prepareProduct<P extends Product = Product>(
    client: Client,
    product: P,
  ) {
    const preparedProducts = await this.prepareProducts(client, [product]);

    return preparedProducts[0];
  }
}
