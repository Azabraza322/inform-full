import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment'; // Импорт environment

interface Message {
  id: number;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: 'new' | 'done';
}

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.scss']
})
export class AdminMessagesComponent implements OnInit {
  messages: Message[] = [];
  isLoading: boolean = true;
  error: string = '';
  router: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.error = '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    // Используем environment.apiUrl
    this.http.get<Message[]>(`${environment.apiUrl}/api/messages`, { headers })
      .subscribe({
        next: (data) => {
          this.messages = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Ошибка при загрузке сообщений';
          this.isLoading = false;
          console.error('Ошибка загрузки:', err);
          
          // Если ошибка авторизации, перенаправляем на логин
          if (err.status === 401) {
            this.router.navigate(['/admin/login']);
          }
        }
      });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Скопировано: ' + text);
    }).catch(() => {
      alert('Не удалось скопировать');
    });
  }

  deleteMessage(id: number) {
    if (!confirm('Удалить сообщение #' + id + '?')) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });

    // Используем environment.apiUrl
    this.http.delete(`${environment.apiUrl}/api/messages/${id}`, { headers })
      .subscribe({
        next: () => {
          this.messages = this.messages.filter(msg => msg.id !== id);
        },
        error: (err) => {
          console.error('Ошибка при удалении:', err);
          alert('Не удалось удалить сообщение');
        }
      });
  }

  toggleStatus(msg: Message) {
    const newStatus = msg.status === 'done' ? 'new' : 'done';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json'
    });

    // Используем environment.apiUrl
    this.http.patch(
      `${environment.apiUrl}/api/messages/${msg.id}`,
      { status: newStatus },
      { headers }
    ).subscribe({
      next: () => {
        msg.status = newStatus;
      },
      error: (err) => {
        console.error('Ошибка при смене статуса:', err);
        alert('Не удалось обновить статус');
      }
    });
  }

  // admin-messages.component.ts
  logout() {
  localStorage.removeItem('auth_token');
  this.router.navigate(['/admin/login']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('ru-RU');
  }
}