import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// Can load se utiliza para ver si la pagina puede ser cargada bajo las condiciones que se definan
export class AuthGuard implements CanLoad {
  // Se puede añadir un constructor para inyectar servicios dentro de Guards
  constructor(private authService: AuthService, private router: Router) {}

  // Metodo canLoad predefinido
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.userIsAuthenticated.pipe(take(1), switchMap(isAuthenticated => {
      // Comprobamos si podemos hacer autologin con datos existentes en el dispositivo
      if (!isAuthenticated) {
        return this.authService.autoLogin();
      } else {
        return of(isAuthenticated);
      }
    }), tap(isAuthenticated => {
      // Si no se ha autenticado, se vuelve a la pagina de auth de login
      if (!isAuthenticated) {
        this.router.navigateByUrl('/auth');
      }
    }));
  }
}
