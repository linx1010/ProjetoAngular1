import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅
import { RecursosService, User } from './recursos.service';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ], 
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  users: User[] = [];
  usersdata: User[] = [];
  loading = false;
  error = '';
  displayedColumns: string[] = [
  'id',
  'name',
  'email',
  'role',
  'active',
  'actions'
];

  dataSource = new MatTableDataSource<User>([]);


  constructor(private recursosService: RecursosService) {}

  ngOnInit() {
    this.loadUsers();
    
  }

  loadUsers() {
    this.loading = true;
    this.recursosService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  abrirCalendario(user: User) {
    console.log('Abrir calendário para:', user);
  }

  visualizar(user: User) {
    console.log('Visualizar detalhes de:', user);
  }

  excluir(user: User) {
    console.log('Excluir usuário:', user);
  }

}
