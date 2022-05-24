import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLeadToOrder1653386996854 implements MigrationInterface {
  name = 'addLeadToOrder1653386996854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "leadId" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "leadId"`);
  }
}
