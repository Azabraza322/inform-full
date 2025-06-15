import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { ContactComponent } from './contact/contact.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';
import { AuthGuard } from './auth.guard'; 
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'admin/login', component: AdminLoginComponent },

  { 
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'messages', component: AdminMessagesComponent }
    ]
  }
];
