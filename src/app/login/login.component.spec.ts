import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeRouter;

  beforeEach(async(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: AngularFireAuth, useValue: {} },
        { provide: Router, useValue: fakeRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.logInWithEmail on logIn', () => {
    const svc = TestBed.get(AuthService)
    spyOn(svc, 'logInWithEmail')
      .and.returnValue(Observable.create(o => {
        o.next({});
        o.complete();
      }));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;
    component.logIn(new Event(''), {valid: true, invalid: false} as NgForm);

    expect(svc.logInWithEmail)
      .toHaveBeenCalledWith(email, pass);
  });

  it('should not call AuthService.logInWithEmail if form is invalid', () => {
    const svc = TestBed.get(AuthService);
    spyOn(svc, 'logInWithEmail')
      .and.returnValue(Observable.create(o => {
        o.next({});
        o.complete();
      }));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;
    component.logIn(new Event(''), {valid: false, invalid: true} as NgForm);

    expect(svc.logInWithEmail)
      .not.toHaveBeenCalled();
  });


  it('should call AuthService.signUpWithEmail on signup', () => {
    const svc = TestBed.get(AuthService);
    spyOn(svc, 'signUpWithEmail')
      .and.returnValue(Observable.create(o => {
        o.next({});
        o.complete();
      }));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.signUp(new Event(''), {valid: true, invalid: false} as NgForm);

    expect(svc.signUpWithEmail)
      .toHaveBeenCalledWith(email, pass);
  });

  it('should not call AuthService.signUpWithEmail if form is invalid', () => {
    const svc = TestBed.get(AuthService);
    spyOn(svc, 'signUpWithEmail')
      .and.returnValue(Observable.create(o => {
        o.next({});
        o.complete();
      }));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.signUp(new Event(''), {valid: false, invalid: true} as NgForm);

    expect(svc.signUpWithEmail)
      .not.toHaveBeenCalled();
  });


  it('should navigate to / after sign up', (done: DoneFn) => {
    const svc = TestBed.get(AuthService);
    spyOn(svc, 'signUpWithEmail')
      .and.returnValue(Observable.create(o => {
        o.next({});
        o.complete();
      }));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.signUp(new Event(''), {valid: true, invalid: false} as NgForm);

    setTimeout(() => {
      expect(fakeRouter.navigateByUrl)
        .toHaveBeenCalledWith('/');
      done();
    }, 0);
  });

});
