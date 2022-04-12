import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsApprovedInProductGrade1649741968315
  implements MigrationInterface
{
  name = 'addIsApprovedInProductGrade1649741968315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_grade" ALTER COLUMN "isApproved" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" ALTER COLUMN "isApproved" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_grade" ALTER COLUMN "isApproved" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_grade" ALTER COLUMN "isApproved" SET NOT NULL`,
    );
  }
}
