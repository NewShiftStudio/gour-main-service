import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPage1649908586696 implements MigrationInterface {
  name = 'addPage1649908586696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pages" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "info" json NOT NULL, "metaId" integer, CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "FK_574394f2b10e351c8f81d27d516" FOREIGN KEY ("metaId") REFERENCES "page_meta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pages" DROP CONSTRAINT "FK_574394f2b10e351c8f81d27d516"`,
    );
    await queryRunner.query(`DROP TABLE "pages"`);
  }
}
