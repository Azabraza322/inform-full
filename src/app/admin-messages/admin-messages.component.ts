import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
  this.isLoading = true;
  this.error = '';

  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<Message[]>('http://localhost:3000/api/messages', { headers }).subscribe({
    next: (data) => {
      this.messages = data;
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Ошибка при загрузке сообщений';
      this.isLoading = false;
      console.error(err);
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

  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  this.http.delete(`http://localhost:3000/api/messages/${id}`, { headers }).subscribe({
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
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  const newStatus = msg.status === 'done' ? 'new' : 'done';

  this.http.patch(`http://localhost:3000/api/messages/${msg.id}/status`, { status: newStatus }, { headers }).subscribe({
    next: () => {
      msg.status = newStatus;
    },
    error: (err) => {
      console.error('Ошибка при смене статуса:', err);
      alert('Не удалось обновить статус');
    }
  });
}

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}

