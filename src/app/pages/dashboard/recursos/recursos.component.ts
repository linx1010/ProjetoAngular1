import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { RecursosService, User } from './recursos.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // para o toggle


// ⭐ Mini componente do Dialog
@Component({
  selector: 'app-recursos-dialog',
  templateUrl: './recursos.dialog.view.html', // usa o HTML separado
  standalone: true,
  imports: [CommonModule, MatDialogModule],
})
export class RecursosDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
@Component({
  selector: 'app-recursos-form-dialog',
  templateUrl: './recursos.dialog.form.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule
  ]
})
export class RecursosFormDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}


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
    MatButtonModule,
    FormsModule,
    MatDialogModule // necessário para abrir dialogs

  ], 
  templateUrl: './recursos.component.html', // 👈 mantém o seu HTML principal
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  users: User[] = [];
  editUser: User | null = null;
  usersdata: User[] = [];
  loading = false;
  showCadastro = false; // controla se o form aparece
  
  error = '';
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role',
    'active',
    'actions'
  ];
  novoUser: any = {
    name: '',
    email: '',
    role: '',
    hourly_rate: null,
    active: true
  };

  toggleCadastro() {
    this.showCadastro = !this.showCadastro;
    if (!this.showCadastro) {
      this.resetForm();
    }
  }

  cancelarCadastro() {
    this.showCadastro = false;
    this.resetForm();
    this.editUser = null; // reseta edição
  }


  salvarCadastro() {
    if (!this.novoUser.name || !this.novoUser.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    if (this.editUser) {
      // atualização de usuário existente
      this.recursosService.updateUser(this.editUser.id, this.novoUser).subscribe({
        next: () => {
          this.loadUsers();        // atualiza tabela
          this.cancelarCadastro(); // fecha formulário
          this.editUser = null;    // reseta edição
        },
        error: (err) => console.error('Erro ao atualizar usuário', err)
      });
    } else {
      // mantém a criação simulada
      const novo = { ...this.novoUser, id: this.users.length + 1 };
      this.users.push(novo);
      this.dataSource.data = [...this.users];
      this.cancelarCadastro();
    }
  }


  resetForm() {
    this.novoUser = {
      name: '',
      email: '',
      role: '',
      hourly_rate: null,
      active: true
    };
  }


  dataSource = new MatTableDataSource<User>([]);

  constructor(private recursosService: RecursosService, private dialog: MatDialog) {}

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
    this.dialog.open(RecursosDialog, {
      width: '600px',
      data: user,
    });
  }

  visualizardata(user: User) {
    console.log('Visualizar detalhes de:', user);
  }

  atualizar(user: User) {
    this.editUser = user;            // guarda o usuário que será editado
    this.novoUser = { ...user };     // copia os dados para o formulário
    this.showCadastro = true;        // mostra o formulário
  }

  inativar(user: User) {
    const atualizado = { ...user, active: user.active ? 0 : 1 }; // alterna o valor
    this.recursosService.updateUser(user.id, atualizado).subscribe({
      next: () => {
        // Atualiza a lista após alteração
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erro ao atualizar usuário', err);
      }
    });
  }
  alerta() {
    alert('alerta');
  }
  abrirCadastro() {
  const dialogRef = this.dialog.open(RecursosFormDialog, {
    panelClass: 'big-dialog',
    autoFocus: false,
    data: { name: '', email: '', role: '', active: true }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Novo usuário cadastrado:', result);
      // aqui você pode enviar para o backend
      // this.users.push(result);
      // this.dataSource.data = [...this.users]; // atualiza tabela
    }
  });
}

}
