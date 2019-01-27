import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthGuard } from './noauth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../mocks/fakeafauth';
import { Observable } from 'rxjs';

describe('NoauthGuard', () => {
  let fakeRouter, fakeAfAuth;
  beforeEach(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']) as Router;
    fakeAfAuth = new FakeAfAuth();
    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: Router, useValue: fakeRouter }
      ]
    });
  });

  it('should construct', inject([NoAuthGuard], (guard: NoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should redirect to / if user is authed', (done: DoneFn) => {
    fakeAfAuth.authState = Observable.create(o => {
      o.next({});
    });

    const guard = new NoAuthGuard(fakeAfAuth, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal instanceof Observable).toBeTruthy();

    (retVal as Observable<any>).subscribe(o => {
      expect(o).toBeFalsy();
      expect(fakeRouter.navigateByUrl)
        .toHaveBeenCalledWith('/');
      done();
    });
  });

  it('should allow routing if user is not authed', (done: DoneFn) => {
    fakeAfAuth.authState = Observable.create(o => {
      o.next();
    });

    const guard = new NoAuthGuard(fakeAfAuth, fakeRouter);
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
