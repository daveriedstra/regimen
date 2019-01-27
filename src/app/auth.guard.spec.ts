import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FakeAfAuth } from '../mocks/fakeafauth';
import { Observable } from 'rxjs';

describe('AuthGuard', () => {
  let fakeRouter, fakeAfAuth;
  beforeEach(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']) as Router;
    fakeAfAuth = new FakeAfAuth();
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: Router, useValue: fakeRouter }
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should redirect to /login if user is not authed', (done: DoneFn) => {
    fakeAfAuth.authState = Observable.create(o => {
      o.next();
    });

    const guard = new AuthGuard(fakeAfAuth, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal instanceof Observable).toBeTruthy();

    (retVal as Observable<any>).subscribe(o => {
      expect(o).toBeFalsy();
      expect(fakeRouter.navigateByUrl)
        .toHaveBeenCalledWith('/login');
      done();
    });
  });

  it('should allow routing if user is authed', (done: DoneFn) => {
    fakeAfAuth.authState = Observable.create(o => {
      o.next({});
    });

    const guard = new AuthGuard(fakeAfAuth, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal instanceof Observable).toBeTruthy();

    (retVal as Observable<any>).subscribe(o => {
      expect(o).toBeTruthy();
      expect(fakeRouter.navigateByUrl)
        .not.toHaveBeenCalled();
      done();
    });
  });
});
