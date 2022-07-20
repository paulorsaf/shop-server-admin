import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { StockOptionRemovedEvent } from "../modules/stocks/commands/remove-stock-option/events/stock-option-removed.event";
import { StockOptionAddedEvent } from "../modules/stocks/commands/add-stock-option/events/stock-option-added.event";
import { EventRepository } from "../repositories/event.repository";
import { CategoryCreatedEvent } from "../modules/categories/commands/create-category/events/category-created.event";
import { CategoryUpdatedEvent } from "../modules/categories/commands/update-category/events/category-updated.event";
import { CategoryDeletedEvent } from "../modules/categories/commands/delete-category/events/category-deleted.event";
import { ProductImageAddedEvent } from "../modules/product-images/commands/add-product-image/events/product-image-added.event";
import { ProductCreatedEvent } from "../modules/products/commands/create-product/events/product-created.event";
import { ProductDeletedEvent } from "../modules/products/commands/delete-product/events/product-deleted.event";
import { ProductUpdatedEvent } from "../modules/products/commands/update-product/events/product-updated.event";
import { StockCreatedEvent } from "../modules/stocks/commands/create-stock/events/stock-created.event";
import { ProductStockUpdatedEvent } from "../modules/products/commands/update-product-stock/events/product-stock-updated.event";
import { StockRemovedEvent } from "../modules/stocks/commands/remove-stock-by-product/events/stock-removed.event";
import { StockOptionUpdatedEvent } from "../modules/stocks/commands/update-stock-option/events/stock-option-updated.event";

@EventsHandler(
    CategoryCreatedEvent,
    CategoryUpdatedEvent,
    CategoryDeletedEvent,
    ProductImageAddedEvent,
    ProductCreatedEvent,
    ProductDeletedEvent,
    ProductUpdatedEvent,
    StockCreatedEvent,
    StockOptionAddedEvent,
    StockOptionRemovedEvent,
    StockOptionUpdatedEvent,
    ProductStockUpdatedEvent,
    StockRemovedEvent
)
export class SaveEventHandler implements IEventHandler<any> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: any) {
        this.eventRepository.addEvent(event);
    }

}