import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;

  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(u => this.isAuthenticated = !!u);
  }

  logInWithEmail(email: string, password: string): Observable<firebase.User> {
    return Observable.create(o => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
          this.afAuth.user
            .pipe( take(1) )
            .subscribe(user => {
              this.isAuthenticated = true;
              o.next(user);
              o.complete();
            }, err => {
              this.isAuthenticated = false;
              o.error(err);
            });
        }, rejReason => {
          this.isAuthenticated = false;
          o.error(rejReason);
        });
    });
  }

  signUpWithEmail(email: string, password: string): Observable<firebase.User> {
    return Observable.create(o => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
          this.afAuth.user
            .pipe( take(1) )
            .subscribe(user => {
              this.isAuthenticated = true;
              o.next(user);
              o.complete();
            }, err => {
              this.isAuthenticated = false;
              o.error(err);
            })
        }, reason => {
          this.isAuthenticated = false;
          o.error(reason);
        });
    });
  }

  logOut(): Observable<void> {
    return Observable.create(o => {
      this.afAuth.auth.signOut()
        .then(() => {
          this.isAuthenticated = false;
          o.next();
          o.complete();
        }, err => {
          o.error(err);
        });
    });
  }
}
