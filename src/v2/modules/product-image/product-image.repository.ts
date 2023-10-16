import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { AddImageUrlsDto, RemoveImageUrlDto } from './dto';
import { ProductImageModel } from './model';

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
    const images: ProductImageModel[] = res.rows;
    return images;
  }

  async removeImageUrl(dto: RemoveImageUrlDto) {
    const { url, productId } = dto;
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM product_image WHERE product_id=$1 AND url=$2;
      `,
      [productId, url],
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

    return res.rows as ProductImageModel[];
  }
}
