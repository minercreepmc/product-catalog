import { ProductManagementDomainService } from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CreateProductProcess } from '@use-cases/create-product/application-services';
import { CreateProductDomainOptions } from '@use-cases/create-product/dtos';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('CreateProductProcess Integration Test', () => {
  let createProductProcess: CreateProductProcess;
  let productManagementService: ProductManagementDomainService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    createProductProcess = new CreateProductProcess(productManagementService);
  });

  describe('execute', () => {
    it('should create a product when the name does not exist', async () => {
      // Arrange
      const domainOptions: CreateProductDomainOptions = {
        name: new ProductNameValueObject('nonexistent_name'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: 'USD',
        }),
      };
      const name = new ProductNameValueObject('unique_name');

      // Act
      const result = await createProductProcess.execute({
        ...domainOptions,
        name,
      });

      // Assert
      expect(result.isOk()).toBeTruthy();
      // Add more assertions for the created product's properties, such as ID or name.
    });

    it('should not create a product when the name exists', async () => {
      // Arrange
      const domainOptions: CreateProductDomainOptions = {
        name: new ProductNameValueObject('existing_name'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: 'USD',
        }),
      };
      const existingName = new ProductNameValueObject('existing_name');

      // Create a product with the same name in the database
      const productCreated = await productManagementService.createProduct({
        ...domainOptions,
        name: existingName,
      });
      expect(productCreated).toBeTruthy();

      // Act
      const result = await createProductProcess.execute({
        ...domainOptions,
        name: existingName,
      });

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for the expected exception or error.
    });
  });
});
