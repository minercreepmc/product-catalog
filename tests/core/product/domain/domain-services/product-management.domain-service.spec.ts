import { AllowableCurrencyEnum } from '@common-domain/value-objects/money';
import {
  CreateProductAggregateOptions,
  ProductAggregate,
  UpdateProductAggregateOptions,
} from '@product-domain/aggregate';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ProductRepositoryPort } from '@product-domain/interfaces';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ProductManagementDomainService', () => {
  let service: ProductManagementDomainService;
  let mockProductRepository: MockProxy<ProductRepositoryPort>;

  beforeEach(() => {
    mockProductRepository = mock<ProductRepositoryPort>();
    service = new ProductManagementDomainService(mockProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isProductExist', () => {
    it('should return true when product exists', async () => {
      const existingProduct = new ProductAggregate();
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(options);

      mockProductRepository.findOneByName.mockResolvedValue(existingProduct);

      const result = await service.isProductExist(options.name);

      expect(result).toBe(true);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });

    it('should return false when product does not exist', async () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Non-existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      mockProductRepository.findOneByName.mockResolvedValue(null);

      const result = await service.isProductExist(options.name);

      expect(result).toBe(false);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product and save it', async () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      await service.createProduct(options);

      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            name: options.name,
            price: options.price,
          }),
        }),
      );
    });
    it('should throw an exception when creating an existing product', async () => {
      const existingProduct = new ProductAggregate();
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(options);

      mockProductRepository.findOneByName.mockResolvedValue(existingProduct);

      await expect(service.createProduct(options)).rejects.toThrowError(
        new ProductDomainException.IsExist(),
      );

      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product and save it', async () => {
      const productId = new ProductIdValueObject('123');

      const existingProduct = new ProductAggregate();
      const createOptions: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Old Product'),
        price: ProductPriceValueObject.create({
          amount: 50,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(createOptions);

      mockProductRepository.findOneById.mockResolvedValue(existingProduct);

      const updateOptions: UpdateProductAggregateOptions = {
        name: new ProductNameValueObject('Old Product'),
        price: ProductPriceValueObject.create({
          amount: 50,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      await service.updateProduct(productId, updateOptions);

      expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneById).toHaveBeenCalledWith(productId);

      expect(existingProduct.details.name).toEqual(createOptions.name);
      expect(existingProduct.details.price).toEqual(createOptions.price);

      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(existingProduct);
    });

    it('should throw an exception when updating a non-existent product', async () => {
      const productId = new ProductIdValueObject('123');
      mockProductRepository.findOneById.mockResolvedValue(null);

      const options: UpdateProductAggregateOptions = {
        name: new ProductNameValueObject('Old Product'),
        price: ProductPriceValueObject.create({
          amount: 50,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      await expect(
        service.updateProduct(productId, options),
      ).rejects.toThrowError(new ProductDomainException.IsNotExist());

      expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneById).toHaveBeenCalledWith(productId);
    });
  });
});
