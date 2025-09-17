import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecursosComponent } from './pages/dashboard/recursos/recursos.component';
import { ClientesComponent } from './pages/dashboard/clientes/clientes.component';
import { ProjetosComponent } from './pages/dashboard/projetos/projetos.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'recursos', component: RecursosComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'projetos', component: ProjetosComponent },
      { path: '', redirectTo: 'recursos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
