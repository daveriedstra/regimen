import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;

  constructor() { }

  loginWithEmail(email: string, password: string): Observable<any> {
    this.isAuthenticated = true;
    return Observable.create(o => {
      o.next();
      o.complete();
    });
  }

  signUpWithEmail(email: string, password: string): Observable<any> {
    this.isAuthenticated = true;
    return Observable.create(o => {
      o.next();
      o.complete();
    });
  }
}
