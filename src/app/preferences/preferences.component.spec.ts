import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreferencesComponent } from './preferences.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { FakeAfstore } from '../../mocks/fake-afstore';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let fakeRouter,
    fakeAfAuth: FakeAfAuth,
    fakeAfstore: FakeAfstore;

  beforeEach(async(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    fakeAfAuth = new FakeAfAuth();
    fakeAfstore = new FakeAfstore();
    TestBed.configureTestingModule({
      declarations: [ PreferencesComponent ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: AngularFirestore, useValue: fakeAfstore }
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
