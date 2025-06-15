import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './interfaces'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        this.router.navigate(['/admin/login']);
        return false;
      }

      const decoded: JwtPayload = jwtDecode<JwtPayload>(token); 
      const isValid = decoded.role === 'admin' && decoded.exp > Date.now() / 1000;

      if (!isValid) {
        this.router.navigate(['/admin/login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('AuthGuard error:', error);
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}
