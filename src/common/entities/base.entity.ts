import { AfterLoad } from 'typeorm';

export class BaseEntity {
  private events: unknown[] = [];

  addEvent(event: unknown): void {
    this.events.push(event);
  }

  clearEvents(): void {
    this.events = [];
  }

  getEvents(): unknown[] {
    return this.events;
  }

  @AfterLoad()
  clearEventsAfterLoad(): void {
    this.clearEvents();
  }
}
