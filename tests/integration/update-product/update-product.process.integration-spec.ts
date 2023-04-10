import { ProductAggregate } from '@aggregates/product';
import { ProductTypeOrmRepository } from '@database/repositories/typeorm/product';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { productRepositoryDiToken } from '@domain-interfaces';
import { ProductManagementDomainService } from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { UpdateProductProcess } from '@use-cases/update-product/application-services';
import { UpdateProductDomainOptions } from '@use-cases/update-product/dtos';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('UpdateProductProcess Integration Test', () => {
  let updateProductProcess: UpdateProductProcess;
  let productManagementService: ProductManagementDomainService;
  let productManagementRepository: ProductTypeOrmRepository;
  let sampleProduct: ProductAggregate;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    productManagementRepository = moduleFixture.get<ProductTypeOrmRepository>(
      productRepositoryDiToken,
    );
    updateProductProcess = new UpdateProductProcess(productManagementService);
    sampleProduct = new ProductAggregate({
      details: {
        name: new ProductNameValueObject('existing'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: 'USD',
        }),
      },
    });
  });

  describe('execute', () => {
    it('should update a product if product does exist', async () => {
      // Arrange
      const { id: productId } = await productManagementRepository.save(
        sampleProduct,
      );

      const domainOptions: UpdateProductDomainOptions = {
        id: productId,
        payload: {
          name: new ProductNameValueObject('new_name'),
          price: ProductPriceValueObject.create({
            amount: 200,
            currency: 'USD',
          }),
        },
      };

      // Act
      const result = await updateProductProcess.execute({
        id: domainOptions.id,
        payload: domainOptions.payload,
      });

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ProductUpdatedDomainEvent);
    });

    it('should not update product if product doest not exist', async () => {
      // Arrange
      const domainOptions: UpdateProductDomainOptions = {
        id: new ProductIdValueObject('nonexistent_id'),
        payload: {
          name: new ProductNameValueObject('new_name'),
          price: ProductPriceValueObject.create({
            amount: 200,
            currency: 'USD',
          }),
        },
      };

      // Act
      const result = await updateProductProcess.execute({
        id: domainOptions.id,
        payload: domainOptions.payload,
      });

      // Assert
      expect(result.isErr()).toBeTruthy();
    });

    // it('should not create a product when the name exists', async () => {});
  });
});
