import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { FakeAfAuth } from '../mocks/fakeafauth';
import { FakeInlineSVGDirective } from '../mocks/fake-inline-svg';

describe('AppComponent', () => {
  let fakeAfAuth: FakeAfAuth;

  beforeEach(async(() => {
    fakeAfAuth = new FakeAfAuth();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        FakeInlineSVGDirective
      ],
      providers: [
        { provide: AngularFireAuth, useValue: fakeAfAuth }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
