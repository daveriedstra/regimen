import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const accountEmail = 'some@addr.email';
  const accountPass = 'asdf!@#123A';

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should default to logged out', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service.isAuthenticated).toBeFalsy();
  });

  it('should show logged in after successful email auth', (done: DoneFn) => {
    const service: AuthService = TestBed.get(AuthService);
    service.loginWithEmail(accountEmail, accountPass)
    .subscribe(() => {
      expect(service.isAuthenticated).toBeTruthy();
      done();
    });
  });

});
