import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export class EntityEventsDispatcher {
  constructor(private readonly eventBus: EventBus) {}
  async dispatch(entity: BaseEntity): Promise<void> {
    const processingEvents = entity
      .getEvents()
      .map((event) => this.eventBus.publish(event));
    await Promise.all(processingEvents);
    entity.clearEvents();
  }
}
