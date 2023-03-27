import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import {
  ProductTypeOrmMapper,
  ProductTypeOrmModel,
} from '@product-infrastructure/database/repositories/typeorm/product';

describe('ProductTypeOrmMapper', () => {
  let mapper: ProductTypeOrmMapper;

  beforeEach(() => {
    mapper = new ProductTypeOrmMapper(ProductAggregate, ProductTypeOrmModel);
  });

  describe('toPersistanceDetails', () => {
    it('should map ProductAggregate details to ProductTypeOrmModel details', () => {
      const productAggregate = new ProductAggregate();
      productAggregate.createProduct({
        name: new ProductNameValueObject('Product 1'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
      });

      const result = (mapper as any).toPersistanceDetails(productAggregate);

      expect(result).toMatchObject({
        name: 'Product 1',
        price: { amount: 10, currency: 'USD' },
      });
    });
  });

  describe('toDomainDetails', () => {
    it('should map ProductTypeOrmModel details to ProductAggregateDetails', () => {
      const ormModel: ProductTypeOrmModel = {
        id: 'some-product-id',
        name: 'Sample Product',
        status: 'ACTIVE',
        price: { amount: 10, currency: 'USD' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = (mapper as any).toDomainDetails(ormModel);

      expect(result.name.unpack()).toEqual('Sample Product');
      expect(result.price.unpack()).toMatchObject({
        amount: 10,
        currency: 'USD',
      });
    });
  });
});
