import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] 
})

export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navigation', { static: true }) navigationRef!: ElementRef;
  activeItem = 'home';
  underlineStyle = {
    width: '0px',
    transform: 'translateX(0px)'
  };

  private resizeObserver: ResizeObserver | null = null;

  constructor(private router: Router, private elRef: ElementRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveItem(event.urlAfterRedirects);
        this.updateUnderlinePosition();
      }
    });
  }

  ngAfterViewInit() {
    this.updateUnderlinePosition();
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  private updateActiveItem(url: string) {
    if (url.includes('/product')) this.activeItem = 'product';
    else if (url.includes('/about')) this.activeItem = 'about';
    else if (url.includes('/contact')) this.activeItem = 'contact';
    else this.activeItem = 'home';
  }

  updateUnderlinePosition() {
    requestAnimationFrame(() => {
      const activeElement = this.elRef.nativeElement.querySelector(`.nav-item.active`);
      const navigation = this.navigationRef.nativeElement;
      
      if (activeElement && navigation) {
        const itemRect = activeElement.getBoundingClientRect();
        const navRect = navigation.getBoundingClientRect();
        const x = itemRect.left - navRect.left;
        const width = itemRect.width;
        
        this.underlineStyle = {
          width: `${width}px`,
          transform: `translateX(${x}px)`
        };
      }
    });
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateUnderlinePosition();
    });
    
    this.resizeObserver.observe(this.navigationRef.nativeElement);
    window.addEventListener('resize', this.updateUnderlinePosition.bind(this));
  }

  onMouseEnter(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const navigation = this.navigationRef.nativeElement;
    
    if (target && navigation) {
      const itemRect = target.getBoundingClientRect();
      const navRect = navigation.getBoundingClientRect();
      const x = itemRect.left - navRect.left;
      const width = itemRect.width;
      
      this.underlineStyle = {
        width: `${width}px`,
        transform: `translateX(${x}px)`
      };
    }
  }

  onMouseLeave() {
    this.updateUnderlinePosition();
  }

  navigateTo(item: string, event: Event) {
    event.preventDefault();
    this.activeItem = item;
    this.updateUnderlinePosition();
    this.router.navigate([`/${item}`]);
  }
}