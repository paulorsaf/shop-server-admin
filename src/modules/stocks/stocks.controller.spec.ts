import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { StocksController } from './stocks.controller';
import { FindStockByProductQuery } from './queries/find-stock-by-product/find-stock-by-product.query';
import { StockOptionDTO } from './dtos/stock-option-dto';
import { CreateStockOptionCommand } from './commands/create-stock/create-stock.command';
import { AddStockOptionCommand } from './commands/add-stock-option/add-stock-option.command';
import { RemoveStockOptionCommand } from './commands/remove-stock-option/remove-stock-option.command';
import { UpdateStockOptionCommand } from './commands/update-stock-option/update-stock-option.command';

describe('StocksController', () => {

  let controller: StocksController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StocksController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<StocksController>(StocksController);
  });

  describe('given find stock by product', () => {

    it('then execute find stock by product query', () => {
      controller.find(user, "anyProductId");
  
      expect(queryBus.executed).toEqual(
        new FindStockByProductQuery(user.companyId, "anyProductId")
      );
    });

  })

  describe('given create stock option', () => {

    const addStockOption: StockOptionDTO = {quantity: 10};

    it('then execute create stock option command', () => {
      controller.create(user, "anyProductId", addStockOption);
  
      expect(commandBus.executed).toEqual(
        new CreateStockOptionCommand(
          user.companyId, "anyProductId", addStockOption, user.id
        )
      );
    });

  })

  describe('given add stock option', () => {

    const addStockOption: StockOptionDTO = {quantity: 10};

    it('then execute add stock option command', () => {
      controller.add(user, "anyProductId", addStockOption);
  
      expect(commandBus.executed).toEqual(
        new AddStockOptionCommand(
          user.companyId, "anyProductId", addStockOption, user.id
        )
      );
    });

  })

  describe('given remove stock option', () => {

    const addStockOption: StockOptionDTO = {quantity: 10};

    it('then execute add stock option command', () => {
      controller.delete(user, "anyProductId", "anyStockId", "anyStockOptionId");
  
      expect(commandBus.executed).toEqual(
        new RemoveStockOptionCommand(
          user.companyId, "anyProductId", "anyStockId", "anyStockOptionId", user.id
        )
      );
    });

  })

  describe('given update stock option', () => {

    const stockOptionDTO: StockOptionDTO = {quantity: 10};

    it('then execute update stock option command', () => {
      controller.update(
        user, "anyProductId", "anyStockId", "anyStockOptionId", stockOptionDTO
      );
  
      expect(commandBus.executed).toEqual(
        new UpdateStockOptionCommand(
          user.companyId, "anyProductId", "anyStockId", "anyStockOptionId", stockOptionDTO,
          user.id
        )
      );
    });

  })

});
