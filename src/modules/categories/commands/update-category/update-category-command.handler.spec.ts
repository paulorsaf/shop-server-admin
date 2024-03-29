import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { UpdateCategoryCommandHandler } from './update-category-command.handler';
import { UpdateCategoryCommand } from './update-category.command';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CategoryUpdatedEvent } from './events/category-updated.event';

describe('UpdateCategoryCommandHandler', () => {

  let handler: UpdateCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  const categoryId = "anyCategoryId";
  const companyId = "anyCompanyId";
  const name = "anyName";
  const userId = "anyUserId";

  const command = new UpdateCategoryCommand(
    categoryId, name, userId, companyId
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCategoryCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CategoryRepository
      ]
    })
    .overrideProvider(CategoryRepository).useValue(categoryRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateCategoryCommandHandler>(UpdateCategoryCommandHandler);
  });

  it('given category not found, then return not found exception', async () => {
    categoryRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given category belongs to company', () => {

    const category = {
      companyId, id: categoryId, name
    }

    it('given category belongs to company, then update category', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(categoryRepository.updatedWith).toEqual({
        id: categoryId, name
      })
    });
  
    it('when category updated, then call category updated event', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CategoryUpdatedEvent(
          {id: categoryId, name},
          companyId,
          userId
        )
      )
    });

  })

  it('given category doesnt belong to company, then return error', async () => {
    const category = {
      companyId: "anyOtherCompanyId"
    }
    categoryRepository.response = category;

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
