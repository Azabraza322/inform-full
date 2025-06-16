import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment'; // Импорт environment

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ContactComponent {
  isModalOpen = false;
  form = { message: '', phone: '', email: '' };
  isLoading = false; // Добавим индикатор загрузки

  constructor(private http: HttpClient) {}

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  submitForm() {
    if (!this.validateForm()) {
      alert('Пожалуйста, заполните все поля корректно.');
      return;
    }

    this.isLoading = true;
    
    // Используем environment.apiUrl вместо хардкодного URL
    this.http.post(`${environment.apiUrl}/api/contact`, this.form)
      .subscribe({
        next: () => {
          alert('Ваше сообщение отправлено!');
          this.closeModal();
        },
        error: (err) => {
          console.error('Ошибка отправки:', err);
          alert('Ошибка при отправке сообщения. Попробуйте позже.');
        },
        complete: () => this.isLoading = false
      });
  }

  validateForm(): boolean {
    return this.form.message.trim() !== '' && 
           this.form.phone.trim() !== '' && 
           this.validateEmail(this.form.email);
  }

  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}