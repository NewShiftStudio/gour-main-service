import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMetaMOdel1653377191062 implements MigrationInterface {
  name = 'addMetaMOdel1653377191062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."meta_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meta_type_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta" ADD "type" "public"."meta_type_enum" NOT NULL`,
    );
  }
}
