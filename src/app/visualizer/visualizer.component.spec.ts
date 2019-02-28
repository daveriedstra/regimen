import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizerComponent } from './visualizer.component';
import DateEntries from '../models/date-entries.interface';
import { SimpleChanges } from '@angular/core';

describe('VisualizerComponent', () => {
  let component: VisualizerComponent;
  let fixture: ComponentFixture<VisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDateClick should emit an event', () => {
    spyOn(component.dateSelected, 'emit');
    const entries: DateEntries = {
      date: new Date(),
      totalDuration: 500,
      entries: [{
        date: new Date(),
        duration: 500,
        description: '',
        note: ''
      }]
    };
    component.onDateClick(entries);
    expect(component.dateSelected.emit).toHaveBeenCalledWith(entries);
  });

  it('#onPrevMonth should emit an event', () => {
    spyOn(component.prevMonth, 'emit');
    component.onPrevMonth();
    expect(component.prevMonth.emit).toHaveBeenCalled();
  });

  it('#onNextMonth should emit an event', () => {
    spyOn(component.nextMonth, 'emit');
    component.onNextMonth();
    expect(component.nextMonth.emit).toHaveBeenCalled();
  });

  it('#onPrevMonth should stage the previous month', () => {
    const currentMonth = new Date(component.stagedMonth);
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    component.onPrevMonth();

    expect(component.stagedMonth.getMonth()).toEqual(currentMonth.getMonth());
    expect(component.stagedMonth.getFullYear()).toEqual(currentMonth.getFullYear());
  });

  it('#onNextMonth should stage the next month', () => {
    const currentMonth = new Date(component.stagedMonth);
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    component.onNextMonth();

    expect(component.stagedMonth.getMonth()).toEqual(currentMonth.getMonth());
    expect(component.stagedMonth.getFullYear()).toEqual(currentMonth.getFullYear());
  });

  it('should redraw the calendar when data is updated', () => {
    const changes: SimpleChanges = {
      data: {
        previousValue: undefined,
        currentValue: [{
          date: new Date(),
          duration: 500,
          description: '',
          note: ''
        }],
        firstChange: false,
        isFirstChange: () => false
      }
    };
    spyOn(component, 'draw');
    component.ngOnChanges(changes);
    expect(component.draw).toHaveBeenCalledWith(changes.data.currentValue);
  });
});
