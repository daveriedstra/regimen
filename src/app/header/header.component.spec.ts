import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FakeInlineSVGDirective } from '../../mocks/fake-inline-svg';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fakeRouter, fakeRoute;

  beforeEach(async(() => {
    fakeRouter = {
      events: of({})
    };
    fakeRoute = {
      // do NOT set firstChild on this statically
      // or the tests will loop!
      snapshot : { }
    };
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        FakeInlineSVGDirective
      ],
      providers: [
        { provide: Router, useValue: fakeRouter },
        { provide: ActivatedRoute, useValue: fakeRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
