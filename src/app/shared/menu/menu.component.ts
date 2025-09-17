import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(private router: Router) {}

  logout() {
    // Limpa qualquer informação de login
    localStorage.removeItem('user');  // caso use localStorage para login
    // Redireciona para a tela de login
    this.router.navigate(['/']);
  }
}
