import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FakeAfstore } from '../../mocks/fake-afstore';
import { AngularFirestore } from '@angular/fire/firestore';
import { FakeAfAuth } from '../../mocks/fakeafauth';
import { AngularFireAuth } from '@angular/fire/auth';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let fakeAfstore: FakeAfstore;
  let fakeAfAuth: FakeAfAuth;

  beforeEach(async(() => {
    fakeAfstore = new FakeAfstore();
    fakeAfAuth = new FakeAfAuth();
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: fakeAfAuth },
        { provide: AngularFirestore, useValue: fakeAfstore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
