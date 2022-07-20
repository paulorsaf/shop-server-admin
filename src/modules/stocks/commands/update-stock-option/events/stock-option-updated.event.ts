import { StockOption } from "../../../entities/stock";

export class StockOptionUpdatedEvent {
    private readonly eventType = "PRODUCT_STOCK_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly originalStockOption: StockOption,
        public readonly stockOption: StockOption,
        public readonly userId: string
    ){}
}