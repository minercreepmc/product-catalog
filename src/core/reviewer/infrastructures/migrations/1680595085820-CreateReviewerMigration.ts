import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewerMigration1680595085820
  implements MigrationInterface
{
  name = 'CreateReviewerMigration1680595085820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reviewer" ("id" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_677dfc9088091c469b6ee6a9c93" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reviewer"`);
  }
}
