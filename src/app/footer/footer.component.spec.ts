import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let fakeRouter,
    fakeAfAuth: FakeAfAuth;

  beforeEach(async(() => {
    fakeRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    fakeAfAuth = new FakeAfAuth();

    TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: AngularFireAuth, useValue: fakeAfAuth }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
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
