import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, LessThan, MoreThan, Repository } from 'typeorm';

import {
  getProductsWithFullCost,
  ProductWithFullCost,
} from './product-cost-calculation.helper';
import { Product } from '../../entity/Product';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductGrade)
    private productGradeRepository: Repository<ProductGrade>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(RoleDiscount)
    private roleDiscountRepository: Repository<RoleDiscount>,

    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async findMany(params: ProductGetListDto, client: Client) {
    // eslint-disable-next-line prefer-const
    let [products, count] = await this.productRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: [
        params.withSimilarProducts ? 'similarProducts' : undefined,
        params.withMeta ? 'meta' : undefined,
        params.withRoleDiscounts ? 'roleDiscounts' : undefined,
        params.withCategories ? 'categories' : undefined,
        'images',
      ].filter((it) => it),
    });

    if (params.withDiscount)
      products = await this.prepareProducts(client, products);

    return [products, count];
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
        params.withCategories && 'categories',
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
          params.withMeta && 'meta',
          params.withRoleDiscounts && 'roleDiscounts',
          params.withGrades && 'productGrades',
          params.withCategories && 'categories',
          params.withCategories && 'categories.parentCategories',
        ].filter((it) => it),
      },
    );

    if (!product) throw new NotFoundException('Товар не найден');

    if (params.withDiscount)
      product = await this.prepareProduct(client, product);

    if (params.withMetrics) {
      const grades = await this.productGradeRepository.find({
        product: { id },
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
        saveParams.categories.push(
          await this.categoryRepository.findOne(categoryId),
        );
      }
    }

    if (dto.similarProducts) {
      const similarProducts: Product[] = [];

      for (const productId of dto.similarProducts) {
        const similarProduct = await this.productRepository.findOne(productId);

        similarProducts.push(similarProduct);
      }

      saveParams.similarProducts = similarProducts;
    }

    if (dto.roleDiscounts) {
      const roleDiscounts: RoleDiscount[] = [];

      for (const roleDiscount of dto.roleDiscounts) {
        const role = await this.clientRoleRepository.findOne(roleDiscount.role);

        roleDiscounts.push(
          this.roleDiscountRepository.create({
            role,
            value: roleDiscount.value,
          }),
        );
      }

      saveParams.roleDiscounts = roleDiscounts;
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

  async update(id: number, product: ProductUpdateDto) {
    const images: Image[] = [];

    if (product.images) {
      for (const imageId of product.images) {
        const image = await this.imageRepository.findOne(imageId);

        if (!image)
          throw new NotFoundException(`Изображение с id=${imageId} не найдено`);

        images.push(image);
      }
    }

    const saveParams: DeepPartial<Product> = {
      title: product.title,
      description: product.description,
      moyskladId: product.moyskladId,
      images,
      price: product.price,
      meta: product.meta,
      id,
    };

    if (product.categoryIds) {
      saveParams.categories = [];
      for (const categoryId of product.categoryIds) {
        saveParams.categories.push(
          await this.categoryRepository.findOne(categoryId),
        );
      }
    }

    if (product.similarProducts) {
      const similarProducts: Product[] = [];

      for (const productId of product.similarProducts) {
        similarProducts.push(await this.productRepository.findOne(productId));
      }

      saveParams.similarProducts = similarProducts;
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

  async prepareProducts<P extends Product = Product>(
    client: Client,
    products: P[],
  ): Promise<ProductWithFullCost<P>[]> {
    const now = new Date();

    const allPromotions = await this.promotionRepository.find({
      where: {
        start: LessThan(now),
        end: MoreThan(now),
      },
      relations: ['products'],
    });

    const productsWithFullCost = getProductsWithFullCost(
      products,
      allPromotions,
      client,
    );

    return productsWithFullCost;
  }

  async prepareProduct<P extends Product = Product>(
    client: Client,
    product: P,
  ): Promise<ProductWithFullCost<P>> {
    const preparedProducts = await this.prepareProducts(client, [product]);

    return preparedProducts[0];
  }
}
