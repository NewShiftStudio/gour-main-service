import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsApprovedInProductGrade1649740177856
  implements MigrationInterface
{
  name = 'addIsApprovedInProductGrade1649740177856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_grade" ADD "isApproved" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_grade" DROP COLUMN "isApproved"`,
    );
  }
}
