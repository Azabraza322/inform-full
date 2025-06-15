import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ContactComponent {
  isModalOpen = false;

  form = {
    message: '',
    phone: '',
    email: ''
  };

  constructor(private http: HttpClient) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitForm() {
  if (this.form.message && this.form.phone && this.validateEmail(this.form.email)) {
    fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.form)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Ответ сервера:', data);
      alert('Ваше сообщение отправлено!');
      this.closeModal();
    })
    .catch(err => {
      console.error('Ошибка отправки:', err);
      alert('Ошибка при отправке сообщения. Попробуйте позже.');
    });
  } else {
    alert('Пожалуйста, заполните все поля корректно.');
  }
}


  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}
