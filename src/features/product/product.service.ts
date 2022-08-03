import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, LessThan, MoreThan, Repository } from 'typeorm';
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
import {
  getProductsWithFullCost,
  ProductWithFullCost,
} from './product-cost-calculation.helper';

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
      ].filter((it) => it),
    });

    if (params.withDiscount) {
      products = await this.prepareProducts(client, products);
    }

    return [products, count];
  }

  findNovelties(params: ProductGetListDto) {
    return this.productRepository.find({
      order: {
        id: 'DESC',
      },
      take: 10,
      relations: [
        params.withSimilarProducts ? 'similarProducts' : undefined,
        params.withMeta ? 'meta' : undefined,
        params.withRoleDiscounts ? 'roleDiscounts' : undefined,
      ].filter((it) => it),
    });
  }

  async getOne(
    id: number,
    params: ProductGetOneDto,
    client: Client,
  ): Promise<ProductWithMetricsDto> {
    let result: ProductWithMetricsDto = await this.productRepository.findOne(
      id,
      {
        relations: [
          params.withSimilarProducts ? 'similarProducts' : undefined,
          params.withMeta ? 'meta' : undefined,
          params.withRoleDiscounts ? 'roleDiscounts' : undefined,
          params.withGrades ? 'productGrades' : undefined,
        ].filter((it) => it),
      },
    );

    if (!result) {
      throw new HttpException('Product with this id was not found', 404);
    }

    if (params.withDiscount) {
      result = (await this.prepareProducts(client, [result]))[0];
    }

    if (params.withMetrics) {
      const grades = await this.productGradeRepository.find({
        product: { id },
      });

      result = {
        ...result,
        gradesCount: grades.length,
        commentsCount: grades.filter((it) => it.comment && it.isApproved)
          .length,
      };
    }

    return result;
  }

  async create(product: ProductCreateDto) {
    const saveParams: Omit<
      ProductCreateDto,
      'category' | 'similarProducts' | 'roleDiscounts' | 'images'
    > & {
      category?: Category | number;
      similarProducts?: (Product | number)[];
      roleDiscounts?: (RoleDiscount | object)[];
      images?: (Image | number)[];
    } = product;

    saveParams.category = await this.categoryRepository.findOne(
      product.category,
    );

    if (product.similarProducts) {
      const similarProducts: Product[] = [];
      for (const productId of product.similarProducts) {
        similarProducts.push(await this.productRepository.findOne(productId));
      }
      saveParams.similarProducts = similarProducts;
    }

    if (product.roleDiscounts) {
      const roleDiscounts: RoleDiscount[] = [];
      for (const roleDiscount of product.roleDiscounts) {
        const role = await this.clientRoleRepository.findOne(roleDiscount.role);
        roleDiscounts.push(
          await this.roleDiscountRepository.create({
            role,
            value: roleDiscount.value,
          }),
        );
      }
      saveParams.roleDiscounts = roleDiscounts;
    }

    saveParams.images = [];
    for (const imageId of product.images) {
      const image = await this.imageRepository.findOne(imageId);
      if (!image) {
        throw new HttpException(`Image with id=${imageId} was not found`, 400);
      }
      saveParams.images.push(image);
    }

    return this.productRepository.save(saveParams as DeepPartial<Product>);
  }

  async update(id: number, product: ProductUpdateDto) {
    const images = [];
    if (product.images) {
      for (const imageId of product.images) {
        const image = await this.imageRepository.findOne(imageId);
        if (!image) {
          throw new HttpException(
            `Image with id=${imageId} was not found`,
            400,
          );
        }
        images.push(image);
      }
    }

    const saveParams: DeepPartial<Product> = {
      title: product.title,
      description: product.description,
      moyskladId: product.moyskladId,
      images,
      price: product.price,
      characteristics: product.characteristics,
      meta: product.meta,
      id,
    };

    if (product.category) {
      saveParams.category = await this.categoryRepository.findOne(
        product.category,
      );
    }

    if (product.similarProducts) {
      const similarProducts: Product[] = [];
      for (const productId of product.similarProducts) {
        similarProducts.push(await this.productRepository.findOne(productId));
      }
      saveParams.similarProducts = similarProducts;
    }

    return this.productRepository.save(saveParams as DeepPartial<Product>);
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

    return getProductsWithFullCost(products, allPromotions, client);
  }

  async prepareProduct<P extends Product = Product>(
    client: Client,
    product: P,
  ): Promise<ProductWithFullCost<P>> {
    return (await this.prepareProducts(client, [product]))[0];
  }
}
