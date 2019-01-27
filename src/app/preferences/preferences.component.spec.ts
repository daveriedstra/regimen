import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PreferencesComponent } from './preferences.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../../mocks/fakeafauth';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let fakeRouter, fakeAfAuth;

  beforeEach(async(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    fakeAfAuth = new FakeAfAuth();
    TestBed.configureTestingModule({
      declarations: [ PreferencesComponent ],
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
});
