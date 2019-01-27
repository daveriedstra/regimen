import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let fakeRouter;
  beforeEach(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']) as Router;
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AngularFireAuth, useValue: {} },
        { provide: Router, useValue: fakeRouter }
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should redirect to /login if user is not authed', () => {
    const fakeAuthSvc = {
      isAuthenticated: false
    } as AuthService;

    const guard = new AuthGuard(fakeAuthSvc, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal).toBeFalsy();
    expect(fakeRouter.navigateByUrl)
      .toHaveBeenCalledWith('/login');
  });

  it('should allow routing if user is authed', () => {
    const fakeAuthSvc = {
      isAuthenticated: true
    } as AuthService;

    const guard = new AuthGuard(fakeAuthSvc, fakeRouter);
    const retVal = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(retVal).toBeTruthy();
    expect(fakeRouter.navigateByUrl)
      .not.toHaveBeenCalled();
  })
});
