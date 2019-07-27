import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  // !! se usa para forzar transformacion a boolean
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(map(storedData => {
      // Comprobamos si existen datos validos
      if (!storedData || !storedData.value) {
        return null;
      }
      // Parseamos el string que se devuelve a formato JSON con la estructura definida en "as"
      const parsedData = JSON.parse(storedData.value) as {
        token: string;
        tokenExpirationDate: string; 
        userId: string,
        email: string
      };
      const expirationTime = new Date(parsedData.tokenExpirationDate);
      // Comprobamos si el token ha expirado
      if (expirationTime <= new Date()) {
        return null;
      }

      // Construimos un usuario a partir de los datos obtenidos
      const user = new User(
        parsedData.userId,
        parsedData.email,
        parsedData.token,
        expirationTime
      );

      return user;
    }), tap(user => {
      if (user) {
        // Asignamos el user
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }), map(user => {
      // Devolvemos true si tenemos user
      return !!user;
    }));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
      {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    // Comprobamos si ya existe timer y lo limpiamos
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    // Limpiamos la memoria de datos de login guardados
    Plugins.Storage.remove({key: 'authData'});
  }

  ngOnDestroy() {
    // Comprobamos si ya existe timer y lo limpiamos
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    // Comprobamos si ya existe timer y lo limpiamos
    if (this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    // Establecemos el timer para una duracion establecida por la duracion del token
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    // Los datos solo se pueden guardar en forma de string
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email});
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
