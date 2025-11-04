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
    if (username === 'admin' && password === '') {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Usuário ou senha inválidos';
    }
  }
  

}
