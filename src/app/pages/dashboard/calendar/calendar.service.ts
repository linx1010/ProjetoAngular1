import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private apiUrl = 'http://localhost:3000/calendar';

  constructor(private http: HttpClient) {}

  getAgenda(tipo: string, id: number): Observable<any[]> {
    const url = `${this.apiUrl}?type=${tipo}&id=${id}`;
    return this.http.get<any[]>(url).pipe(
      catchError(err => {
        console.error('Erro ao buscar agenda:', err);
        return of([]);
      })
    );
  }
}
