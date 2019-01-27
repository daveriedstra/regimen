import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';

class FakeAfAuth {
  user = new Subject();
  auth = {
    createUserWithEmailAndPassword: () => this.createUserWithEmailAndPassword(),
    signInWithEmailAndPassword: () => this.signInWithEmailAndPassword(),
    signOut: () => this.signOut()
  };

  private resolveUser(res) {
    res();
    setTimeout(() => this.user.next({}), 0);
  }

  createUserWithEmailAndPassword() {
    return new Promise(r => this.resolveUser(r));
  }

  signInWithEmailAndPassword() {
    return new Promise(r => this.resolveUser(r));
  }

  signOut() {
    return Promise.resolve();
  }
}

describe('AuthService', () => {
  let fakeAfAuth;
  const accountEmail = 'some@addr.email';
  const accountPass = 'asdf!@#123A';

  beforeEach(() => {
    fakeAfAuth = new FakeAfAuth();

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: fakeAfAuth },
      ]
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should default to logged out', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service.isAuthenticated).toBeFalsy();
  });

  it('should call angularFire createUser method on signUp', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'createUserWithEmailAndPassword')
      .and.callThrough();

    const service = new AuthService(fakeAfAuth);
    service.signUpWithEmail(accountEmail, accountPass)
      .subscribe(() => {
        expect(fakeAfAuth.auth.createUserWithEmailAndPassword)
          .toHaveBeenCalledWith(accountEmail, accountPass);
        done();
      });
  });

  it('should call angularFire signIn method on login', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'signInWithEmailAndPassword')
      .and.callThrough();

    const service = new AuthService(fakeAfAuth);
    service.logInWithEmail(accountEmail, accountPass)
      .subscribe(() => {
        expect(fakeAfAuth.auth.signInWithEmailAndPassword)
          .toHaveBeenCalledWith(accountEmail, accountPass);
        done();
      });
  });

  it('should show logged in after successful email login', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'signInWithEmailAndPassword')
      .and.callThrough();

    const service = new AuthService(fakeAfAuth);
    service.logInWithEmail(accountEmail, accountPass)
      .subscribe(() => {
        expect(service.isAuthenticated).toBeTruthy();
        done();
      });
  });

  it('should show logged in after successful email sign up', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'createUserWithEmailAndPassword')
      .and.callThrough();

    const service = new AuthService(fakeAfAuth);
    service.signUpWithEmail(accountEmail, accountPass)
      .subscribe(() => {
        expect(service.isAuthenticated).toBeTruthy();
        done();
      });
  });

  it('should show not logged in after failed email login', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'signInWithEmailAndPassword')
      .and.returnValue(new Promise((res, rej) => rej('login failed')));

    const service = new AuthService(fakeAfAuth);
    service.logInWithEmail(accountEmail, accountPass)
      .subscribe(undefined, () => {
        expect(service.isAuthenticated).toBeFalsy();
        done();
      });
  });

  it('should show not logged in after failed email signup', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'createUserWithEmailAndPassword')
      .and.returnValue(new Promise((res, rej) => rej('signup failed')));

    const service = new AuthService(fakeAfAuth);
    service.signUpWithEmail(accountEmail, accountPass)
      .subscribe(undefined, () => {
        expect(service.isAuthenticated).toBeFalsy();
        done();
      });
  });

  it('should call firebase signout method', (done: DoneFn) => {
    spyOn(fakeAfAuth.auth, 'signOut')
      .and.callThrough();

    const service = new AuthService(fakeAfAuth);
    service.logOut()
      .subscribe(() => {
        expect(fakeAfAuth.auth.signOut)
          .toHaveBeenCalled();
        done();
      });
  });

  it('should show not logged in after successful signout', (done: DoneFn) => {
    const service = new AuthService(fakeAfAuth);
    service.logInWithEmail(accountEmail, accountPass)
      .subscribe(() => {
        service.logOut()
          .subscribe(() => {
            expect(service.isAuthenticated).toBeFalsy();
            done();
          });
      });
  });

});
