import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Product } from '../../entity/Product';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ProductCreateDto } from './dto/product.create.dto';
import { Category } from '../../entity/Category';
import { ProductUpdateDto } from './dto/product.update.dto';
import { RoleDiscount } from '../../entity/RoleDiscount';
import { ProductGetListDto } from './dto/product.get-list.dto';
import { ProductGetOneDto } from './dto/product.get-one.dto';
import { ClientRole } from '../../entity/ClientRole';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(RoleDiscount)
    private roleDiscountRepository: Repository<RoleDiscount>,
    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,
  ) {}

  findMany(params: ProductGetListDto) {
    return this.productRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      relations: [
        params.withSimilarProducts ? 'similarProducts' : undefined,
        params.withMeta ? 'meta' : undefined,
        params.withRoleDiscounts ? 'roleDiscounts' : undefined,
      ].filter((it) => it),
    });
  }

  findNovelties() {
    return this.productRepository.find({
      order: {
        id: 'DESC',
      },
      take: 10,
    });
  }

  getOne(id: number, params: ProductGetOneDto) {
    return this.productRepository.findOne(
      { id },
      {
        relations: [
          params.withSimilarProducts ? 'similarProducts' : undefined,
          params.withMeta ? 'meta' : undefined,
          params.withRoleDiscounts ? 'roleDiscounts' : undefined,
        ].filter((it) => it),
      },
    );
  }

  async create(product: ProductCreateDto) {
    const saveParams: Omit<
      ProductCreateDto,
      'category' | 'similarProducts' | 'roleDiscounts'
    > & {
      category?: Category | number;
      similarProducts?: (Product | number)[];
      roleDiscounts?: (RoleDiscount | object)[];
    } = product;
    saveParams.category = await this.categoryRepository.findOne(
      product.category,
    );

    if (product.similarProducts) {
      const similarProducts: Product[] = [];
      for (const productId of product.similarProducts) {
        similarProducts.push(
          await this.productRepository.findOne({ id: productId }),
        );
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
            rub: roleDiscount.rub,
            eur: roleDiscount.eur,
          }),
        );
      }
      saveParams.roleDiscounts = roleDiscounts;
    }
    return this.productRepository.save(saveParams as DeepPartial<Product>);
  }

  async update(id: number, product: ProductUpdateDto) {
    const saveParams: DeepPartial<Product> = {
      title: product.title,
      description: product.description,
      moyskladId: product.moyskladId,
      images: product.images,
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
}
