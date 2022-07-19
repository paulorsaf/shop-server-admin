import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductStockCommandHandler } from './update-product-stock-command.handler';
import { UpdateProductStockCommand } from './update-product-stock.command';
import { ProductRepositoryMock } from '../../../../mocks/product-repository.mock';
import { ProductRepository } from '../../repositories/product.repository';
import { NotFoundException } from '@nestjs/common';

describe('UpdateProductStockCommandHandler', () => {

  let handler: UpdateProductStockCommandHandler;
  let productRepository: ProductRepositoryMock;

  const command = new UpdateProductStockCommand(
    'anyCompanyId', 'anyProductId', 10
  );

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateProductStockCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .compile();

    handler = module.get<UpdateProductStockCommandHandler>(UpdateProductStockCommandHandler);
  });

  it('given product not found, then throw not found exception', async () => {
    productRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product found, when product doesnt belong to company, then throw not found exception', async () => {
    productRepository.response = {companyId: 'anyOtherCompanyId', stock: 5};

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product found, the update stock on product', async () => {
    productRepository.response = {companyId: 'anyCompanyId', stock: 5};

    await handler.execute(command);

    expect(productRepository.updatedStockWith).toEqual({
      amount: 15, productId: "anyProductId"
    });
  });

});