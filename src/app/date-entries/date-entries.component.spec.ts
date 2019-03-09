import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEntriesComponent } from './date-entries.component';

describe('DateEntriesComponent', () => {
  let component: DateEntriesComponent;
  let fixture: ComponentFixture<DateEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
