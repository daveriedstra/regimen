import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FakeAfAuth } from '../../mocks/fakeafauth';

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
        { provide: AngularFireAuth, useValue: new FakeAfAuth() },
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

  it('should call AfAuth signin method on logIn', () => {
    const svc = TestBed.get(AngularFireAuth)
    spyOn(svc.auth, 'signInWithEmailAndPassword')
      .and.returnValue(Promise.resolve({}));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;
    component.doLogIn(new Event(''), {valid: true, invalid: false} as NgForm);

    expect(svc.auth.signInWithEmailAndPassword)
      .toHaveBeenCalledWith(email, pass);
  });

  it('should not call AfAuth login method if form is invalid', () => {
    const svc = TestBed.get(AngularFireAuth);
    spyOn(svc.auth, 'signInWithEmailAndPassword')
      .and.returnValue(Promise.resolve({}));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;
    component.doLogIn(new Event(''), {valid: false, invalid: true} as NgForm);

    expect(svc.auth.signInWithEmailAndPassword)
      .not.toHaveBeenCalled();
  });

  it('should call AfAuth sign up method on signup', () => {
    const svc = TestBed.get(AngularFireAuth);
    spyOn(svc.auth, 'createUserWithEmailAndPassword')
      .and.returnValue(Promise.resolve({}));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.doSignUp(new Event(''), {valid: true, invalid: false} as NgForm);

    expect(svc.auth.createUserWithEmailAndPassword)
      .toHaveBeenCalledWith(email, pass);
  });

  it('should not call AfAuth sign up method if form is invalid', () => {
    const svc = TestBed.get(AngularFireAuth);
    spyOn(svc.auth, 'createUserWithEmailAndPassword')
      .and.returnValue(Promise.resolve({}));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.doSignUp(new Event(''), {valid: false, invalid: true} as NgForm);

    expect(svc.auth.createUserWithEmailAndPassword)
      .not.toHaveBeenCalled();
  });

  it('should navigate to / after sign up', (done: DoneFn) => {
    const svc = TestBed.get(AngularFireAuth);
    spyOn(svc.auth, 'createUserWithEmailAndPassword')
      .and.returnValue(Promise.resolve({}));

    const email = 'test@email.net',
      pass = 'asdf123ASDF@$';
    component.email = email;
    component.pass = pass;

    component.doSignUp(new Event(''), {valid: true, invalid: false} as NgForm);

    setTimeout(() => {
      expect(fakeRouter.navigateByUrl)
        .toHaveBeenCalledWith('/');
      done();
    }, 0);
  });

});
