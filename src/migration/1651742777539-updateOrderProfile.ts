import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOrderProfile1651742777539 implements MigrationInterface {
  name = 'updateOrderProfile1651742777539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "street" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "house" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "apartment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "entrance" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "floor" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "floor"`);
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP COLUMN "entrance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_profile" DROP COLUMN "apartment"`,
    );
    await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "house"`);
    await queryRunner.query(`ALTER TABLE "order_profile" DROP COLUMN "street"`);
    await queryRunner.query(
      `ALTER TABLE "order_profile" ADD "address" character varying NOT NULL`,
    );
  }
}
