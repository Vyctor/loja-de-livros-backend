import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EntityEventsDispatcher } from './events/entity-events-dispatcher';

@Module({
  imports: [CqrsModule],
  providers: [EntityEventsDispatcher],
  exports: [EntityEventsDispatcher],
})
export class CommonModule {}
