import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Контактная форма
  sendContactForm(data: any) {
    return this.http.post(`${this.baseUrl}/api/contact`, data);
  }

  // Авторизация админа
  adminLogin(password: string) {
    return this.http.post(`${this.baseUrl}/api/admin/login`, { password });
  }

  // Получение сообщений (с авторизацией)
  getMessages() {
    return this.http.get(`${this.baseUrl}/api/messages`);
  }
}