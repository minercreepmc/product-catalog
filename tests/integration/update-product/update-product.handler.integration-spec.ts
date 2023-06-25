import { ProductAggregate } from '@aggregates/product';
import { ProductTypeOrmRepository } from '@database/repositories/typeorm/product';
import { productRepositoryDiToken } from '@domain-interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductRequestDto,
  UpdateProductResponseDto,
} from '@use-cases/update-product/dtos';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('UpdateProductHandler (integration test)', () => {
  let handler: UpdateProductHandler;
  let productManagementRepository: ProductTypeOrmRepository;
  let sampleProduct: ProductAggregate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    handler = module.get<UpdateProductHandler>(UpdateProductHandler);
    productManagementRepository = module.get<ProductTypeOrmRepository>(
      productRepositoryDiToken,
    );

    sampleProduct = new ProductAggregate({
      details: {
        name: new ProductNameValueObject('existing'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: 'USD',
        }),
      },
    });

    await productManagementRepository.save(sampleProduct);
  });

  // Test scenarios go here
  // ... other tests

  test('should update a product if the command is valid', async () => {
    // Arrange
    const command = new UpdateProductRequestDto({
      id: sampleProduct.id.unpack(),
      name: 'new_name',
      price: {
        amount: 200,
        currency: 'USD',
      },
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(UpdateProductResponseDto);
  });
});
