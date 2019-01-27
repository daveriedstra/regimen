import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthGuard } from './noauth.guard';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../mocks/fakeafauth';

describe('NoauthGuard', () => {
  let fakeRouter;
  beforeEach(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']) as Router;
    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: AngularFireAuth, useValue: new FakeAfAuth() },
        { provide: Router, useValue: fakeRouter }
      ]
    });
  });

  it('should construct', inject([NoAuthGuard], (guard: NoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should redirect to / if user is authed', () => {
    const fakeAuthSvc = {
      isAuthenticated: true
    } as AuthService;

    const guard = new NoAuthGuard(fakeAuthSvc, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal).toBeFalsy();
    expect(fakeRouter.navigateByUrl)
      .toHaveBeenCalledWith('/');
  });

  it('should allow routing if user is not authed', () => {
    const fakeAuthSvc = {
      isAuthenticated: false
    } as AuthService;

    const guard = new NoAuthGuard(fakeAuthSvc, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal).toBeTruthy();
    expect(fakeRouter.navigateByUrl)
      .not.toHaveBeenCalled();
  });
});
