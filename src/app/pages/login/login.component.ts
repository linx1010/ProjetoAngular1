import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['']
    });
  }

  login() {
    const { username, password } = this.form.value;
    const users = [
    { username: 'admin', password: '', role: 'admin' },
    { username: 'manager', password: '', role: 'manager' },
    { username: 'member', password: '', role: 'member' },
    { username: 'finance', password: '', role: 'finance' }
    ];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('userRole', user.role);
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Usuário ou senha inválidos';
    }
  }
  

}
