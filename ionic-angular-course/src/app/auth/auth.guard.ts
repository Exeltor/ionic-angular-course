import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

// Can load se utiliza para ver si la pagina puede ser cargada bajo las condiciones que se definan
export class AuthGuard implements CanLoad {
  // Se puede añadir un constructor para inyectar servicios dentro de Guards
  constructor(private authService: AuthService, private router: Router) {}

  // Metodo canLoad predefinido
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    // Si el usuario no esta autenticado, se redirige a la pagina de autentificacion
    if (!this.authService.userIsAuthenticated) {
      this.router.navigateByUrl('/auth');
    }

    // Si esta autenticado, se devuelve True
    return this.authService.userIsAuthenticated;
  }
}
