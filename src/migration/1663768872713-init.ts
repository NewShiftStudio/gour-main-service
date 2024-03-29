/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1663768872713 implements MigrationInterface {
  name = 'init1663768872713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client_role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_ea545365f74ddd2a7ed1fd42639" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f8c190ffce3879b0976ddea329" ON "client_role" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "translatable_string" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "en" character varying NOT NULL, "ru" character varying NOT NULL, CONSTRAINT "PK_a0a03e1b1d8a14b623b5b9f38ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "translatable_text" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "en" text NOT NULL, "ru" text NOT NULL, CONSTRAINT "PK_a0354615370e03f2091d8fcf729" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nameId" integer, CONSTRAINT "REL_eb8d4681a9e076bc9f09306004" UNIQUE ("nameId"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "warehouse" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "cityId" integer, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_modification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "weight" double precision NOT NULL, "quantityInStock" integer NOT NULL, "moyskladCode" integer, "titleId" integer, "productId" integer, "warehouseId" integer, CONSTRAINT "REL_c9b97435eeae763d5b95f756e2" UNIQUE ("titleId"), CONSTRAINT "PK_3f28d75fbfc0f6eb7557967bda7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "small" character varying(500) NOT NULL, "full" character varying(500) NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "price" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "cheeseCoin" double precision NOT NULL, CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_discount" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "value" double precision, "productId" integer, "roleId" integer, CONSTRAINT "PK_702d9acfe28690723e9643d28ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "page_meta" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isIndexed" boolean NOT NULL, "metaTitleId" integer, "metaDescriptionId" integer, "metaKeywordsId" integer, CONSTRAINT "REL_8ef4128799f0ec6b977e510677" UNIQUE ("metaTitleId"), CONSTRAINT "REL_53a840fcaeb0d559310dafdd15" UNIQUE ("metaDescriptionId"), CONSTRAINT "REL_d53d522ae2122c91f7f060481b" UNIQUE ("metaKeywordsId"), CONSTRAINT "PK_b574b1106b84794c4855125b1da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_grade" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "value" integer NOT NULL, "comment" text, "productId" integer NOT NULL, "isApproved" boolean, "clientId" integer, CONSTRAINT "PK_a88b9e97d20f3a6b869d9106662" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "discount" double precision NOT NULL, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "titleId" integer, "descriptionId" integer, "cardImageId" integer, "pageImageId" integer, "pageMetaId" integer, CONSTRAINT "REL_a0ce259462d12956f2f82d8fda" UNIQUE ("titleId"), CONSTRAINT "REL_89585f924623c005955def7209" UNIQUE ("descriptionId"), CONSTRAINT "REL_fa1fa014a3fd586e3698953d8e" UNIQUE ("cardImageId"), CONSTRAINT "REL_f325fc9229f5113f4b244c49bd" UNIQUE ("pageImageId"), CONSTRAINT "REL_3f2d99e5a8b8ba0d1a1476167e" UNIQUE ("pageMetaId"), CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discount" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "price" integer NOT NULL DEFAULT '0', "clientId" integer, "productCategoryId" integer, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "titleId" integer, CONSTRAINT "REL_a9d1c20a576c149e88f138fae7" UNIQUE ("titleId"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "moyskladId" character varying, "grade" double precision NOT NULL DEFAULT '0', "isWeightGood" boolean NOT NULL DEFAULT false, "weight" integer NOT NULL DEFAULT '0', "amount" integer NOT NULL DEFAULT '0', "discount" integer NOT NULL DEFAULT '0', "titleId" integer, "descriptionId" integer, "priceId" integer, "metaId" integer, CONSTRAINT "REL_44d88a251d2f34e750dca4d6bb" UNIQUE ("titleId"), CONSTRAINT "REL_d5d42fd534bb1f80feddda7bc4" UNIQUE ("descriptionId"), CONSTRAINT "REL_40e084538467ad26eda659598a" UNIQUE ("priceId"), CONSTRAINT "REL_c71846744ead3d8c2f0fd7e5d6" UNIQUE ("metaId"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_code" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_669df184f201c602c986bacd804" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e2228930b1cc8b983445357b1b" ON "referral_code" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_profile" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "street" character varying NOT NULL, "house" character varying NOT NULL, "apartment" character varying, "entrance" character varying, "floor" character varying, "comment" character varying, "cityId" integer, "clientId" integer, CONSTRAINT "PK_3d946eba1edd6c4043bd388cd64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_transaction_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."wallet_transaction_status_enum" AS ENUM('init', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet_transaction" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."wallet_transaction_type_enum" NOT NULL, "status" "public"."wallet_transaction_status_enum" NOT NULL, "secretToken" character varying NOT NULL, "prevValue" integer NOT NULL, "newValue" integer NOT NULL, "description" text NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "walletUuid" uuid, CONSTRAINT "PK_2edf24640f2e1dc331977104ef4" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "signature" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "clientId" integer, CONSTRAINT "REL_ffd77d29122e631ffd7be89a5c" UNIQUE ("clientId"), CONSTRAINT "PK_ac5b822bf9c91fe42b32f804c2f" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "client" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isApproved" boolean NOT NULL DEFAULT false, "additionalInfo" json NOT NULL DEFAULT '{}', "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "phone" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL DEFAULT '', "lives" integer NOT NULL DEFAULT '3', "roleId" integer, "cityId" integer, "referralCodeId" integer, "avatarId" integer, "mainOrderProfileId" integer, "walletUuid" uuid, CONSTRAINT "REL_e6810a06b1e242ee7bc7f8a6d7" UNIQUE ("avatarId"), CONSTRAINT "REL_f3e010b4df6cd1e01ce41573ae" UNIQUE ("mainOrderProfileId"), CONSTRAINT "REL_a6d377be9382dd96764f4edd0b" UNIQUE ("walletUuid"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "meta" ("key" character varying NOT NULL, "value" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_7f87cee620b4cb5946a0d9595d4" PRIMARY KEY ("key"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "weight" integer NOT NULL, "amount" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('init', 'basketFilling', 'registration', 'payment', 'paid', 'atThePointOfIssue', 'delivery', 'completed', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."order_status_enum" NOT NULL, "comment" text NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "leadId" integer, "clientId" integer, "orderProfileId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "page" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "key" character varying NOT NULL, "info" json NOT NULL, "metaId" integer, CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_category" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_7e60cbb6e911363b5ff8ed28e85" PRIMARY KEY ("productId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotion_products_product" ("promotionId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_0075d4cc54e56dc551282411096" PRIMARY KEY ("promotionId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e5b23c891ed81ace1193becf2" ON "promotion_products_product" ("promotionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8902fc8f3cfd2382ed45cf8d3" ON "promotion_products_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category_sub_categories_category" ("categoryId_1" integer NOT NULL, "categoryId_2" integer NOT NULL, CONSTRAINT "PK_1a22fdb591bc34cc211c3c9b402" PRIMARY KEY ("categoryId_1", "categoryId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39e8d7722905b4dd379c10b9dc" ON "category_sub_categories_category" ("categoryId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_240614301ac462e921842924e7" ON "category_sub_categories_category" ("categoryId_2") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_images_image" ("productId" integer NOT NULL, "imageId" integer NOT NULL, CONSTRAINT "PK_d326f439909c5e540caf4d640af" PRIMARY KEY ("productId", "imageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59e342befd2e3c2933b2f89b7d" ON "product_images_image" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72057fd26667428255bcb600d0" ON "product_images_image" ("imageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_similar_products_product" ("productId_1" integer NOT NULL, "productId_2" integer NOT NULL, CONSTRAINT "PK_fb88d0f2423f64d5f5ce751c8ce" PRIMARY KEY ("productId_1", "productId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_076c991d327b40f0aef21e71c6" ON "product_similar_products_product" ("productId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67657b7f7da91ab492d104e8a1" ON "product_similar_products_product" ("productId_2") `,
    );
    await queryRunner.query(
      `CREATE TABLE "client_favorites_product" ("clientId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_5a58a6de3137caa80cd31027d8d" PRIMARY KEY ("clientId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f993cf9ff6d7a9fbc376df0dd" ON "client_favorites_product" ("clientId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b98ec66a26d314c5b31ce4bc4e" ON "client_favorites_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON "product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON "product_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_eb8d4681a9e076bc9f093060049" FOREIGN KEY ("nameId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "warehouse" ADD CONSTRAINT "FK_bbe802d870eac43404f8a5ec371" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" ADD CONSTRAINT "FK_c9b97435eeae763d5b95f756e23" FOREIGN KEY ("titleId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" ADD CONSTRAINT "FK_6ac70b6304648f5ff036774e3ee" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" ADD CONSTRAINT "FK_2e2f5ea704a4235e9e7f1704a91" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_discount" ADD CONSTRAINT "FK_20367aae6a5626ac8b228165ac0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_discount" ADD CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" ADD CONSTRAINT "FK_8ef4128799f0ec6b977e510677e" FOREIGN KEY ("metaTitleId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" ADD CONSTRAINT "FK_53a840fcaeb0d559310dafdd156" FOREIGN KEY ("metaDescriptionId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" ADD CONSTRAINT "FK_d53d522ae2122c91f7f060481b7" FOREIGN KEY ("metaKeywordsId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" ADD CONSTRAINT "FK_ed279cf7798d3345643be600567" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" ADD CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_a0ce259462d12956f2f82d8fda0" FOREIGN KEY ("titleId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_89585f924623c005955def7209a" FOREIGN KEY ("descriptionId") REFERENCES "translatable_text"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_fa1fa014a3fd586e3698953d8e1" FOREIGN KEY ("cardImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_f325fc9229f5113f4b244c49bd8" FOREIGN KEY ("pageImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_3f2d99e5a8b8ba0d1a1476167ed" FOREIGN KEY ("pageMetaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_67faa706ae94be23a61f7ff1eea" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_43691d9392812f38ca117f1181a" FOREIGN KEY ("productCategoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_a9d1c20a576c149e88f138fae74" FOREIGN KEY ("titleId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_44d88a251d2f34e750dca4d6bba" FOREIGN KEY ("titleId") REFERENCES "translatable_string"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_d5d42fd534bb1f80feddda7bc42" FOREIGN KEY ("descriptionId") REFERENCES "translatable_text"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_40e084538467ad26eda659598ac" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_c71846744ead3d8c2f0fd7e5d66" FOREIGN KEY ("metaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD CONSTRAINT "FK_84f283ef3b79483c5d885c90521" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD CONSTRAINT "FK_2cee74ce10c15e8b6f2675dadfc" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_transaction" ADD CONSTRAINT "FK_e47a5f26f2afee3d2cd0f938968" FOREIGN KEY ("walletUuid") REFERENCES "wallet"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_ffd77d29122e631ffd7be89a5cf" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_596dadf4ff5b01bd50869c57993" FOREIGN KEY ("roleId") REFERENCES "client_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_00581f54a58f23d0a540d522d6a" FOREIGN KEY ("referralCodeId") REFERENCES "referral_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb" FOREIGN KEY ("mainOrderProfileId") REFERENCES "order_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "FK_a6d377be9382dd96764f4edd0b9" FOREIGN KEY ("walletUuid") REFERENCES "wallet"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_4e3ffc94c1abb277c072b2600cc" FOREIGN KEY ("orderProfileId") REFERENCES "order_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "page" ADD CONSTRAINT "FK_7cefdc1a09fcac0b34480032046" FOREIGN KEY ("metaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_products_product" ADD CONSTRAINT "FK_1e5b23c891ed81ace1193becf2b" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_products_product" ADD CONSTRAINT "FK_d8902fc8f3cfd2382ed45cf8d3c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sub_categories_category" ADD CONSTRAINT "FK_39e8d7722905b4dd379c10b9dc2" FOREIGN KEY ("categoryId_1") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sub_categories_category" ADD CONSTRAINT "FK_240614301ac462e921842924e7d" FOREIGN KEY ("categoryId_2") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images_image" ADD CONSTRAINT "FK_59e342befd2e3c2933b2f89b7d0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images_image" ADD CONSTRAINT "FK_72057fd26667428255bcb600d07" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_similar_products_product" ADD CONSTRAINT "FK_076c991d327b40f0aef21e71c69" FOREIGN KEY ("productId_1") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_similar_products_product" ADD CONSTRAINT "FK_67657b7f7da91ab492d104e8a1c" FOREIGN KEY ("productId_2") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" ADD CONSTRAINT "FK_6f993cf9ff6d7a9fbc376df0dde" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" ADD CONSTRAINT "FK_b98ec66a26d314c5b31ce4bc4e1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" DROP CONSTRAINT "FK_b98ec66a26d314c5b31ce4bc4e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_favorites_product" DROP CONSTRAINT "FK_6f993cf9ff6d7a9fbc376df0dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_930110e92aed1778939fdbdb302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_similar_products_product" DROP CONSTRAINT "FK_67657b7f7da91ab492d104e8a1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_similar_products_product" DROP CONSTRAINT "FK_076c991d327b40f0aef21e71c69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images_image" DROP CONSTRAINT "FK_72057fd26667428255bcb600d07"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images_image" DROP CONSTRAINT "FK_59e342befd2e3c2933b2f89b7d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sub_categories_category" DROP CONSTRAINT "FK_240614301ac462e921842924e7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_sub_categories_category" DROP CONSTRAINT "FK_39e8d7722905b4dd379c10b9dc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_products_product" DROP CONSTRAINT "FK_d8902fc8f3cfd2382ed45cf8d3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_products_product" DROP CONSTRAINT "FK_1e5b23c891ed81ace1193becf2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page" DROP CONSTRAINT "FK_7cefdc1a09fcac0b34480032046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_4e3ffc94c1abb277c072b2600cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_a6d377be9382dd96764f4edd0b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_f3e010b4df6cd1e01ce41573aeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_e6810a06b1e242ee7bc7f8a6d73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_00581f54a58f23d0a540d522d6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_7eb2f065d88ba8ad74d65f898f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_596dadf4ff5b01bd50869c57993"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_ffd77d29122e631ffd7be89a5cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_transaction" DROP CONSTRAINT "FK_e47a5f26f2afee3d2cd0f938968"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP CONSTRAINT "FK_2cee74ce10c15e8b6f2675dadfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP CONSTRAINT "FK_84f283ef3b79483c5d885c90521"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_c71846744ead3d8c2f0fd7e5d66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_40e084538467ad26eda659598ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_d5d42fd534bb1f80feddda7bc42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_44d88a251d2f34e750dca4d6bba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_a9d1c20a576c149e88f138fae74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_43691d9392812f38ca117f1181a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_67faa706ae94be23a61f7ff1eea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_3f2d99e5a8b8ba0d1a1476167ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_f325fc9229f5113f4b244c49bd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_fa1fa014a3fd586e3698953d8e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_89585f924623c005955def7209a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_a0ce259462d12956f2f82d8fda0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" DROP CONSTRAINT "FK_4d957dd2ce451c778ba4f853af8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" DROP CONSTRAINT "FK_ed279cf7798d3345643be600567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" DROP CONSTRAINT "FK_d53d522ae2122c91f7f060481b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" DROP CONSTRAINT "FK_53a840fcaeb0d559310dafdd156"`,
    );
    await queryRunner.query(
      `ALTER TABLE "page_meta" DROP CONSTRAINT "FK_8ef4128799f0ec6b977e510677e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_discount" DROP CONSTRAINT "FK_a69dad1a9445e23f892cbffaadf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_discount" DROP CONSTRAINT "FK_20367aae6a5626ac8b228165ac0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" DROP CONSTRAINT "FK_2e2f5ea704a4235e9e7f1704a91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" DROP CONSTRAINT "FK_6ac70b6304648f5ff036774e3ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_modification" DROP CONSTRAINT "FK_c9b97435eeae763d5b95f756e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "warehouse" DROP CONSTRAINT "FK_bbe802d870eac43404f8a5ec371"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_eb8d4681a9e076bc9f093060049"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_559e1bc4d01ef1e56d75117ab9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_930110e92aed1778939fdbdb30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b98ec66a26d314c5b31ce4bc4e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f993cf9ff6d7a9fbc376df0dd"`,
    );
    await queryRunner.query(`DROP TABLE "client_favorites_product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67657b7f7da91ab492d104e8a1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_076c991d327b40f0aef21e71c6"`,
    );
    await queryRunner.query(`DROP TABLE "product_similar_products_product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_72057fd26667428255bcb600d0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59e342befd2e3c2933b2f89b7d"`,
    );
    await queryRunner.query(`DROP TABLE "product_images_image"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_240614301ac462e921842924e7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39e8d7722905b4dd379c10b9dc"`,
    );
    await queryRunner.query(`DROP TABLE "category_sub_categories_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d8902fc8f3cfd2382ed45cf8d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e5b23c891ed81ace1193becf2"`,
    );
    await queryRunner.query(`DROP TABLE "promotion_products_product"`);
    await queryRunner.query(`DROP TABLE "product_category"`);
    await queryRunner.query(`DROP TABLE "page"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_product"`);
    await queryRunner.query(`DROP TABLE "meta"`);
    await queryRunner.query(`DROP TABLE "client"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "wallet_transaction"`);
    await queryRunner.query(
      `DROP TYPE "public"."wallet_transaction_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."wallet_transaction_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "order_profile"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2228930b1cc8b983445357b1b"`,
    );
    await queryRunner.query(`DROP TABLE "referral_code"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "discount"`);
    await queryRunner.query(`DROP TABLE "promotion"`);
    await queryRunner.query(`DROP TABLE "product_grade"`);
    await queryRunner.query(`DROP TABLE "page_meta"`);
    await queryRunner.query(`DROP TABLE "role_discount"`);
    await queryRunner.query(`DROP TABLE "price"`);
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "product_modification"`);
    await queryRunner.query(`DROP TABLE "warehouse"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "translatable_text"`);
    await queryRunner.query(`DROP TABLE "translatable_string"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8c190ffce3879b0976ddea329"`,
    );
    await queryRunner.query(`DROP TABLE "client_role"`);
  }
}
