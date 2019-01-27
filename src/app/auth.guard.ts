import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Redirects to /login if user is not authenticated
 * To be used on internal routes.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AngularFireAuth, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return Observable.create(o => {
        this.auth.authState.subscribe(u => {
          // user present: we are authed
          if (!!u) {
            o.next(true);
            return o.complete();
          }

          // not authed
          this.router.navigateByUrl('/login');
          o.next(false);
          return o.complete();
        });
      });
  }
}
