import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient // Добавлен HttpClient
  ) {}

  login() {
    this.http.post<any>('https://inform-full.onrender.com', {
      password: this.password
  }).subscribe({
    next: (res) => {
      localStorage.setItem('auth_token', res.token);
      this.router.navigate(['/admin/messages']);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Ошибка авторизации';
    }
  });
  }
}