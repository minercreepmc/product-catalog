import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeJsonbToText1683795584288 implements MigrationInterface {
    name = 'ChangeJsonbToText1683795584288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "parentIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "parentIds" text array`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "subCategoryIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "subCategoryIds" text array`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "productIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "productIds" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "productIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "productIds" jsonb array`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "subCategoryIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "subCategoryIds" jsonb array`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "parentIds"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "parentIds" jsonb array`);
    }

}
