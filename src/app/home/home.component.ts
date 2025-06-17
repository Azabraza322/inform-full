import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

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
      description: 'Онлайн-передача фискальных данных в ФНС согласно требованиям 54-ФЗ. Отправка чеков по СМС и e-mail. Аналитика по торговым точкам.',
      icon: 'fa-file-contract',
      color: 'white'
    },
    {
      title: 'Контур.Зарплата',
      description: 'Легкий и понятный расчет заработной платы и налоговых отчислений. Подготовка необходимой отчетности в ФНС, ФСС, ПФР и пр.',
      icon: 'fa-wallet',
      color: 'white'
    },
    {
      title: 'Контур.Маркет',
      description: 'Товарный учет в режиме онлайн. Касса и печать номенклатуры в чеке в соответствии с 54-ФЗ. Работа с ЕГАИС.',
      icon: 'fa-shopping-cart',
      color: 'white'
    },
    {
      title: 'Контур.Персонал',
      description: 'Автоматизируйте все этапы кадрового учета. Отраслевые решения: Госслужба, Медицина, Производство.',
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
