import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { CalendarService } from './calendar.service';




@Component({
  selector: 'app-root',
  templateUrl: 'calendar.component.html',
  standalone:true,
  imports:[CommonModule, DatePipe, FormsModule, HttpClientModule],
  styleUrls: ['calendar.component.scss']
})


export class CalendarComponent {
  currentDate = new Date();
  days: any[] = [];
  // events: { [key: string]: string[] } = {
  //   '2025-09-22': ['Reunião com equipe'],
  //   '2025-09-25': ['Entrega do projeto']
  // };
  events: { [key: string]: string[] } = {}; 
  
  tipo: string = '';
  id: number = 0;
  constructor(private route: ActivatedRoute, private calendarService: CalendarService){}

  ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo')!;
    this.id = +this.route.snapshot.paramMap.get('id')!;
    
    this.carregarAgenda();
  }
  carregarAgenda() {
    this.calendarService.getAgenda(this.tipo, this.id).subscribe(agenda => {
      this.events = {};

      agenda.forEach(evento => {
        if (!evento.start_time) return;

        const dateKey = this.formatDateKey(evento.start_time);
        if (!this.events[dateKey]) this.events[dateKey] = [];
        const descricao = `${evento.title}${evento.location ? ' @ ' + evento.location : ''}`;
        this.events[dateKey].push(descricao);
      });

      this.generateCalendar(); 
    });
  }

  formatDateKey(dateTime: string): string {
    return dateTime.split(' ')[0];
  }

  generateCalendar() {
    this.days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      this.days.push({ day: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.days.push({
        day,
        events: this.events[dateKey] || []
      });
    }
  }

  prevMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentDate = new Date(year, month - 1, 1);
    this.carregarAgenda();
  }

nextMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.currentDate = new Date(year, month + 1, 1);
    this.carregarAgenda();
  }
  selectedDay: { day: number, events: string[] } | null = null;

  onDayClick(day: any) {
    if (day.day) {
      this.selectedDay = day;
    }
  }
  newEvent: string = '';

addEvent() {
  if (this.selectedDay && this.newEvent.trim()) {
    this.selectedDay.events.push(this.newEvent.trim());
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const day = this.selectedDay.day;
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (!this.events[dateKey]) {
      this.events[dateKey] = [];
    }
    this.events[dateKey].push(this.newEvent.trim());
    this.newEvent = '';
  }
}

}
