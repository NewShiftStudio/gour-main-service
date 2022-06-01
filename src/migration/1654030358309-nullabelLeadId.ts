import { MigrationInterface, QueryRunner } from 'typeorm';

export class nullabelLeadId1654030358309 implements MigrationInterface {
  name = 'nullabelLeadId1654030358309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "leadId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "leadId" SET NOT NULL`,
    );
  }
}
