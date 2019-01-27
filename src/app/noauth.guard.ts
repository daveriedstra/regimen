import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Redirects to / if user is already authenticated.
 * To be used only on exclusively public routes, such as /login
 */
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return Observable.create(o => {
        this.auth.authState.subscribe(u => {
          // user present: we are authed
          if (!!u) {
            this.router.navigateByUrl('/');
            o.next(false);
            return o.complete();
          }

          // not authed
          o.next(true);
          return o.complete();
        });
      });
  }
}
