import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { RiccoImperatrizCompanyStockRepository } from '../repositories/ricco-imperatriz-company-stock.repository';
import { RiccoSaoLuisCompanyStockRepository } from '../repositories/ricco-sao-luis-company-stock.repository';
import { CompanyStockFactory } from './company-stock.factory';

describe('CompanyStockFactory', () => {

    let factory: CompanyStockFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule
            ],
            providers: [
                CompanyStockFactory,
                RiccoImperatrizCompanyStockRepository,
                RiccoSaoLuisCompanyStockRepository
            ]
        })
        .compile();

        factory = module.get<CompanyStockFactory>(CompanyStockFactory);
    });

    it('given company is ricco sao luis, then return ricco sao luis', async () => {
        expect(factory.createStock('ZHcTZOE3HqGilGhNcgUR'))
            .toBeInstanceOf(RiccoSaoLuisCompanyStockRepository);
    });

    it('given company is ricco imperatriz, then return ricco imperatriz', async () => {
        expect(factory.createStock('yYRhNlwkCAWSBztRo887'))
            .toBeInstanceOf(RiccoImperatrizCompanyStockRepository);
    });

    it('given company is not found, then return null', async () => {
        expect(factory.createStock('anyCompanyId'))
            .toBeNull();
    });

});