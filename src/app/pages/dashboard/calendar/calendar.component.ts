import { Component } from '@angular/core';
import { CommonModule, DatePipe, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CalendarEvent,
  CalendarView,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule,
} from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    NgSwitch,
    NgSwitchCase,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  // Views
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;

  // Data
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(),
      title: 'Evento inicial',
      color: { primary: '#1e90ff', secondary: '#D1E8FF' },
    },
  ];

  // Helpers
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;
  modalData: { action: string; event: CalendarEvent } | undefined;

  // Navegação
  setView(view: CalendarView) {
    this.view = view;
  }

  goToToday() {
    this.viewDate = new Date();
  }

  goToNext() {
    if (this.view === CalendarView.Month) {
      this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1));
    } else if (this.view === CalendarView.Week) {
      this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() + 7));
    } else {
      this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() + 1));
    }
  }

  goToPrevious() {
    if (this.view === CalendarView.Month) {
      this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1));
    } else if (this.view === CalendarView.Week) {
      this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() - 7));
    } else {
      this.viewDate = new Date(this.viewDate.setDate(this.viewDate.getDate() - 1));
    }
  }

  // Eventos do calendário
  dayClicked(event: { date: Date; events: CalendarEvent[] }): void {
    if (this.view === CalendarView.Month) {
      if (
        (this.activeDayIsOpen && event.date.getTime() === this.viewDate.getTime()) ||
        event.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = event.date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: {
    event: CalendarEvent;
    newStart: Date;
    newEnd?: Date;
  }): void {
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'Novo evento',
        start: new Date(),
        end: new Date(),
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  trackByEvent(index: number, event: CalendarEvent): string {
    return event.title + event.start?.toISOString();
  }
}
