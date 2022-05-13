import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPageMetaIntoPromotion1652456989790
  implements MigrationInterface
{
  name = 'addPageMetaIntoPromotion1652456989790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promotion" ADD "pageMetaId" integer`);
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "UQ_3f2d99e5a8b8ba0d1a1476167ed" UNIQUE ("pageMetaId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_3f2d99e5a8b8ba0d1a1476167ed" FOREIGN KEY ("pageMetaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_3f2d99e5a8b8ba0d1a1476167ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "UQ_3f2d99e5a8b8ba0d1a1476167ed"`,
    );
    await queryRunner.query(`ALTER TABLE "promotion" DROP COLUMN "pageMetaId"`);
  }
}
