import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router'; // ✅ Обязательно добавить

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  products = [
    {
      title: 'Контур.ОФД',
      description: 'Онлайн-передача фискальных данных...',
      icon: 'fa-file-contract',
      color: 'white'
    },
    {
      title: 'Контур.Зарплата',
      description: 'Расчет заработной платы...',
      icon: 'fa-wallet',
      color: 'white'
    },
    {
      title: 'Контур.Маркет',
      description: 'Автоматизация бизнеса...',
      icon: 'fa-shopping-cart',
      color: 'white'
    },
    {
      title: 'Контур.Персонал',
      description: 'Автоматизация кадрового делопроизводства...',
      icon: 'fa-users',
      color: 'white'
    }
  ];

  currentSlide = 0;
  slideInterval: any;

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.products.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.products.length - 1 ? 0 : this.currentSlide + 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  ngOnInit() {
    this.slideInterval = setInterval(() => this.nextSlide(), 10000);
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }
}
