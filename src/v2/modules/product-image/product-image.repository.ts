import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { AddImageUrlsDto } from './dtos';

@Injectable()
export class ProductImageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async addImageUrls(dto: AddImageUrlsDto) {
    const { urls, productId } = dto;
    const res = await this.databaseService.runQuery(
      ` 
        INSERT INTO product_image (product_id, url)
        SELECT $1, unnest($2::varchar[]) AS urls
        RETURNING *;
      `,
      [productId, urls],
    );
    return res.rows;
  }

  async getProductImages(productId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT * FROM product_image WHERE product_id=$1;
      `,
      [productId],
    );

    return res.rows;
  }
}
