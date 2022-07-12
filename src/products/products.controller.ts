import { Controller, UseGuards, Get, Post, Param, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../authentication/guards/jwt.admin.strategy';
import { User } from '../authentication/model/user';
import { CreateProductCommand } from './commands/create-product/create-product.command';
import { CreateProductDTO } from './commands/create-product/dtos/create-product.dto';
import { Product } from './entities/product';
import { FindProductsByCompanyQuery } from './queries/find-by-company/find-products-by-company.query';

@Controller('products')
export class ProductsController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindProductsByCompanyQuery(user.companyId)
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  save(@AuthUser() user: User, @Body() product: CreateProductDTO) {
    return this.commandBus.execute(
      new CreateProductCommand(
        product, user.companyId, user.id
      )
    );
  }

}
