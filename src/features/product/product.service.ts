import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
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
import {WarehouseService} from "../warehouse/warehouse.service";

const MAP_ROLE_PRICE_TYPE: any = {
  'cbcf493b-55bc-11d9-848a-00112f43529a': 'individual',
  '643f2204-655f-44d2-a70c-115df3163e0d': 'companyByCash',
  '825b0462-6bc4-4825-8f77-0e31fa7ee311': 'company',
};

@Injectable()
export class ProductService {
  constructor(
    private categoryService: CategoryService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @Inject(WarehouseService) readonly warehouseService: WarehouseService,

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
    client?: Client,
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

    //todo:  это получается удалить - ОТ
    const weightByProduct = {}
    for (const product of products) {
      const isMeat = product.categories?.find(productSubCategory => productSubCategory.id === 131);

      const weight = isMeat ? 100 : 150;
      weightByProduct[product.moyskladId] = weight + 'гр';
      product.defaultWeight = weight;
    }

    const stocksByProduct = await this.warehouseService.getStockOfManyProductByWarehouseIdCityNameAndGram(
        weightByProduct,
        'Санкт-Петербург'
    );

    for (const product of products) {
      const stock = stocksByProduct[product.moyskladId]
      if (stock !== undefined) {
        product.defaultStock = stock;
      }
    }

    //todo:  это получается удалить - ДО, изменить критерий сортировки
    const quantityByProduct =  await this.warehouseService.getQuantityByAssortmentIds(
        products.filter((p) => p.isWeighed).map((p) => p.moyskladId),
        'Санкт-Петербург'
    );

    for (const product of products) {
      const weight = quantityByProduct[product.moyskladId]
      if (weight !== undefined) {
        product.weight = weight * 1000;
      }
    }

    products = products.sort(
        (a:any,b: any) =>  (a.defaultStock?.value ?? Boolean(a.weight) ??  -1)
            - (b.defaultStock?.value ?? Boolean(b.weight) ?? -1)
    );

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

  async findNovelties(params: ProductGetListDto, client?: Client) {
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

    const weightByProduct = {}
    for (const product of products) {
      const isMeat = product.categories?.find(productSubCategory => productSubCategory.id === 131);

      const weight = isMeat ? 100 : 150;
      weightByProduct[product.moyskladId] = weight + 'гр';
      product.defaultWeight = weight;
    }

    const stocksByProduct = await this.warehouseService.getStockOfManyProductByWarehouseIdCityNameAndGram(
        weightByProduct,
        'Санкт-Петербург'
    );

    for (const product of products) {
      const stock = stocksByProduct[product.moyskladId]
      if (stock !== undefined) {
        product.defaultStock = stock;
      }
    }

    const quantityByProduct =  await this.warehouseService.getQuantityByAssortmentIds(
        products.filter((p) => p.isWeighed).map((p) => p.moyskladId),
        'Санкт-Петербург'
    );

    for (const product of products) {
      const weight = quantityByProduct[product.moyskladId]
      if (weight !== undefined) {
        product.weight = weight * 1000;
      }
    }

    products = products
        .filter((product:any) => product.defaultStock?.value || product.weight)
        .sort(
            (a:any,b: any) =>  (a.defaultStock?.value ?? Boolean(a.weight) ??  -1)
                - (b.defaultStock?.value ?? Boolean(b.weight) ?? -1)
        ).reverse();

    if (params.withDiscount) {
      products = await this.prepareProducts(client, products);
    }

    return products;
  }

  async getSimilar(params: ProductGetSimilarDto, client: Client|undefined) {
    const productIds = params.productIds.split(',').map((id) => +id);

    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.similarProducts', 'similarProducts')
      .leftJoinAndSelect('similarProducts.title', 'similarProductsTitle')
      .leftJoinAndSelect('similarProducts.price', 'similarProductsPrice')
      .leftJoinAndSelect('similarProducts.images', 'similarProductsImages')
      .leftJoinAndSelect('similarProducts.categories', 'categories')
      .leftJoinAndSelect('categories.title', 'categoryTitle')
      .leftJoinAndSelect('categories.subCategories', 'categorySubCategories')
      .leftJoinAndSelect(
        'categories.parentCategories',
        'category.parentCategories',
      )
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();

    const similarProducts: Product[] = [];

    for (const product of products) {
      if (!product.similarProducts) continue;

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

    let fullSimilarProducts = await this.prepareProducts(
      client,
      similarProducts,
    );

    const weightByProduct = {}
    for (const product of fullSimilarProducts) {
      const isMeat = product.categories?.find(productSubCategory => productSubCategory.id === 131);

      const weight = isMeat ? 100 : 150;
      weightByProduct[product.moyskladId] = weight + 'гр';
      product.defaultWeight = weight;
    }

    const stocksByProduct = await this.warehouseService.getStockOfManyProductByWarehouseIdCityNameAndGram(
        weightByProduct,
        'Санкт-Петербург'
    );

    const quantityByProduct =  await this.warehouseService.getQuantityByAssortmentIds(
        fullSimilarProducts.filter((p) => p.isWeighed).map((p) => p.moyskladId),
        'Санкт-Петербург'
    );

    for (const product of fullSimilarProducts) {
      const stock = stocksByProduct[product.moyskladId]
      if (stock !== undefined) {
        product.defaultStock = stock;
      }

      const weight = quantityByProduct[product.moyskladId]
      if (weight !== undefined) {
        product.weight = weight * 1000;
      }
    }

    fullSimilarProducts = fullSimilarProducts.filter((product:any) => product.defaultStock?.value || product.weight)

    return fullSimilarProducts;
  }

  async getOne(
    id: number,
    params: ProductGetOneDto,
    client?: Client,
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

    if (product.isWeighed) {
      const quantityByProduct = await this.warehouseService.getQuantityByAssortmentIds(
          [product.moyskladId],
          'Санкт-Петербург'
      );
      product.weight = (quantityByProduct[product.moyskladId] ?? 0) * 1000;
    }

    if (product.similarProducts) {
      const weightByProduct = {}
      product.similarProducts = product.similarProducts.map((similarProduct) => {
        const isMeat = similarProduct.categories?.find(productSubCategory => productSubCategory.id === 131);

        const weight = isMeat ? 100 : 150;
        weightByProduct[similarProduct.moyskladId] = weight + 'гр';
        similarProduct.defaultWeight = weight;

        return similarProduct;
      })

      const stocksByProduct = await this.warehouseService.getStockOfManyProductByWarehouseIdCityNameAndGram(
          weightByProduct,
          'Санкт-Петербург'
      );

      const quantityByProduct =  await this.warehouseService.getQuantityByAssortmentIds(
          product.similarProducts.filter((p) => p.isWeighed).map((p) => p.moyskladId),
          'Санкт-Петербург'
      );

      product.similarProducts = product.similarProducts.map((similarProduct) => {
        const stock = stocksByProduct[similarProduct.moyskladId]
        if (stock !== undefined) {
          similarProduct.defaultStock = stock;
        }

        const weight = quantityByProduct[product.moyskladId]
        if (weight !== undefined) {
          product.weight = weight * 1000;
        }

        return similarProduct;
      });
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

    // Идентификаторы в браузере и апи отличаются,поэтому идём в апи чтобы получить актуальный
    if (dto.moyskladId) {
      const moyskladProduct = await this.warehouseService.moyskladService.getProductById(dto.moyskladId);
      dto.moyskladId = moyskladProduct.id;

      let prices = [];
      const priceTypesByExternalCode = {
        'cbcf493b-55bc-11d9-848a-00112f43529a': '015ae8a2-f130-11eb-0a80-0235000e61cf',
        '643f2204-655f-44d2-a70c-115df3163e0d': '85a8e750-b589-11ec-0a80-06d100086547',
        '825b0462-6bc4-4825-8f77-0e31fa7ee311': 'b919d491-3598-11ed-0a80-0bbb00082dd9'
      };
      for (const [key, value] of Object.entries(dto.price)) {
        if (value !== undefined && key !== 'cheeseCoin') {
          prices[key] = value;
          const priceExternalCode = Object.entries(MAP_ROLE_PRICE_TYPE).find(([priceKey, priceId]) => priceId === key)[0];
          const priceId = priceTypesByExternalCode[priceExternalCode];
          prices.push({
            value: value * 100,
            priceType: {
              meta: {
                href: `https://online.moysklad.ru/api/remap/1.2/context/companysettings/pricetype/${priceId}`,
                type: 'pricetype',
                mediaType: 'application/json'
              }
            }
          })
        }
      }
      if (prices.length) {
        await this.warehouseService.moyskladService.updateProduct(
            dto.moyskladId,
            {salePrices: prices}
        );
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
      grade: dto.grade,
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

  async prepareProducts<P extends Product>(client: Client|undefined, products: P[]) {
    const now = new Date();

    const promotions = await this.promotionRepository.find({
      where: {
        start: LessThan(now),
        end: MoreThan(now),
      },
      relations: ['products'],
    });

    const categoriesWithDiscounts = client === undefined
        ? []
        : await this.categoryService.findCategoriesWithDiscounts(client); // категории для системы наеденности

    let role;
    if (client === undefined) {
      role = undefined;
    } else {
      const fullClient = await this.clientRepository.findOne(client.id);
      role = fullClient.role;
    }

    const productsWithDiscount = getProductsWithDiscount(
        products,
        promotions,
        role,
        categoriesWithDiscounts,
    );

    return productsWithDiscount;
  }

  async prepareProduct<P extends Product = Product>(
    client: Client|undefined,
    product: P,
  ) {
    const preparedProducts = await this.prepareProducts(client, [product]);

    return preparedProducts[0];
  }

  async updateProductByWebhook(productUuid: string) {
    let productDb = await this.productRepository.findOne(
        {
          where: {
            moyskladId: productUuid
          },
        },
    );

    if (!productDb) {
      console.log(`Продукта с uuid=${productUuid} нет в базе`);
      return {message: 'Успех'};
    }

    const productWarehouse = await this.warehouseService.moyskladService.getProductById(productUuid);
    productDb.isWeighed = productWarehouse.weighed ?? false;

    // Группируем цены
    for (const priceObj of productWarehouse.salePrices) {
      const type = MAP_ROLE_PRICE_TYPE[priceObj.priceType.externalCode];
      if (type) {
        productDb.price[type] = priceObj.value / 100; // делим на 100 т.к. копейки
      } else {
        console.log(`Неизвестный тип цены ${priceObj}`)
      }
    }

    await this.productRepository.save(productDb);

    console.log(`Обновили продукт продукт с uuid=${productUuid}`);

    return {message: 'Успех'};
  }
}