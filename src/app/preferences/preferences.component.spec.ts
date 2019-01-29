import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreferencesComponent } from './preferences.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { FormsModule } from '@angular/forms';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let fakeRouter, 
    fakeAfAuth: FakeAfAuth;

  beforeEach(async(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    fakeAfAuth = new FakeAfAuth();
    TestBed.configureTestingModule({
      declarations: [ PreferencesComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: AngularFireAuth, useValue: fakeAfAuth }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AngularFire logout method', () => {
    spyOn(fakeAfAuth.auth, 'signOut')
      .and.returnValue(Promise.resolve());
    component.doLogOut();
    expect(fakeAfAuth.auth.signOut)
      .toHaveBeenCalled();
  });

  it('should redirect to / on logout', (done: DoneFn) => {
    component.doLogOut();
    setTimeout(() => {
      expect(fakeRouter.navigateByUrl)
        .toHaveBeenCalledWith('/');
      done();
    });
  });

  it('should call firebase updateEmail method', (done: DoneFn) => {
    const userSpy = { updateEmail: () => {} };
    spyOn(userSpy, 'updateEmail')
      .and.returnValue(Promise.resolve({}));

    fakeAfAuth.user.subscribe((u: any) => {
      component.newEmail = 'new@email.addr';
      component.updateEmail();
      expect(u.updateEmail)
        .toHaveBeenCalledWith(component.newEmail);
      done();
    });
    fakeAfAuth.user.next(userSpy);
  });

  it('should call firebase updatePassword method', (done: DoneFn) => {
    const userSpy = { updatePassword: () => {} };
    spyOn(userSpy, 'updatePassword')
      .and.returnValue(Promise.resolve({}));

    fakeAfAuth.user.subscribe((u: any) => {
      component.newPassword = 'asdf!@#123ASDF';
      component.updatePassword();
      expect(u.updatePassword)
        .toHaveBeenCalledWith(component.newPassword);
      done();
    });
    fakeAfAuth.user.next(userSpy);
  });
});
