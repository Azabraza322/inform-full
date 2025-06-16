import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
  isLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post<{ token: string }>(
      `${environment.apiUrl}/api/admin/login`, 
      { password: this.password }
    ).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        this.router.navigate(['/admin/messages']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Ошибка авторизации';
        console.error('Ошибка входа:', err);
      },
      complete: () => this.isLoading = false
    });
  }
}