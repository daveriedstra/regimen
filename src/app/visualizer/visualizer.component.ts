import {
  Component,
  OnInit,
  AfterContentInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import DateEntries from '../models/date-entries.interface';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit, AfterContentInit, OnChanges {
  @Input()
  data: DateEntries[];

  @Output()
  dateSelected = new EventEmitter();

  today = new Date();
  stagedMonth = new Date();
  weekdays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

  width = 3000;
  height = 1000;
  datumPadding = 50;

  colWidth = this.width / 7;
  rowWidth = this.height / 5;
  datumRadius = Math.min(this.colWidth, this.rowWidth) / 2 - this.datumPadding;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.data) {
      this.drawCalendar();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.data = this.ensureDataHasToday(this.data);
    }
  }

  drawCalendar() {
    const svg = d3.select('.visualizer-content');
    const displayedData = this.data.filter(d => {
      return (
        d.date.getMonth() === this.stagedMonth.getMonth()
        &&
        d.date.getFullYear() === this.stagedMonth.getFullYear()
      );
    });
    const maxDuration = displayedData.map(e => e.totalDuration)
      .reduce((prev, cur) => Math.max(prev, cur), 0);
    const firstWeekLength = this.getFirstWeekLength(this.stagedMonth);

    const dates = svg.select('.dates')
      .selectAll('circle')
      .data(displayedData)
      .join('circle');

    // all data
    dates.attr('r', this.datumRadius)
      .attr('cx', d => this.getEntryXPos(d))
      .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
      .attr('fill-opacity', d => d.totalDuration / maxDuration)
      .classed('date', true)
      .on('click', this.onDateClick.bind(this));

    // today indicator
    dates.filter(d => d.date.getDate() === this.today.getDate())
      .attr('r', this.datumRadius - 0.3 * this.datumRadius)
      .attr('cx', d => this.getEntryXPos(d))
      .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
      .classed('today', true)
      .classed('today--empty', d => d.totalDuration < 1)
      .classed('today--dark', d => d.totalDuration / maxDuration > 0.4);

    // out-of-month indicators
    const lastOfMonth = this.getLastDayOfMonth(this.stagedMonth);
    const preDates = 7 - firstWeekLength;
    const postDates = 6 - lastOfMonth.getDay();
    const bounds = svg.select('.bounds');

    bounds.selectAll('rect.pre-dates')
      .data([preDates])
      .join('rect')
      .classed('pre-dates', true)
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 25)
        .attr('ry', 25)
        .attr('width', d => this.colWidth * d)
        .attr('height', this.rowWidth);

    bounds.selectAll('rect.post-dates')
      .data([postDates])
      .join('rect')
      .classed('post-dates', true)
        .attr('x', this.colWidth * (lastOfMonth.getDay() + 1))
        .attr('y', this.height - this.rowWidth)
        .attr('rx', 25)
        .attr('ry', 25)
        .attr('width', d => this.colWidth * d)
        .attr('height', this.rowWidth);
  }

  onPrevMonth() {
    this.stagedMonth = this.getPreviousMonth(this.stagedMonth);
    this.drawCalendar();
  }

  onNextMonth() {
    this.stagedMonth = this.getNextMonth(this.stagedMonth);
    this.drawCalendar();
  }

  onDateClick(d: DateEntries) {
    if (d.entries.length > 0) {
      this.dateSelected.emit(d);
    }
  }

  /**
   * Gets the X position value for a DateEntries
   * @param e DateEntries
   */
  private getEntryXPos(e: DateEntries): number {
    return e.date.getDay() * this.colWidth + (0.5 * this.colWidth);
  }

  /**
   * Gets the Y position value for a DateEntries
   * @param e DateEntries
   */
  private getEntryYPos(e: DateEntries, firstWeekLength: number): number {
    return this.getWeekForDate(e.date, firstWeekLength) * this.rowWidth + (0.5 * this.rowWidth);
  }

  /**
   * Ensures that the data has a datapoint representing today,
   * even if there is no data for today. This is not a problem
   * if the month is different; it will just be filtered out.
   * @param d data
   */
  private ensureDataHasToday(d: DateEntries[]): DateEntries[] {
    const todayData = d.find(x => x.date.getDate() === this.today.getDate());

    if (!todayData) {
      d.push({
        date: new Date(),
        totalDuration: 0,
        entries: []
      });
    }

    return d;
  }

  //
  // Date utilities
  //

  /**
   * Gets the length of the first week (in days)
   * of the month in which the provided entries fall
   * @param data list of entries to check
   */
  private getFirstWeekLength(date: Date): number {
    const firstWeekday = new Date(date);
    firstWeekday.setDate(1);

    return 7 - firstWeekday.getDay();
  }

  /**
   * Gets the 0-indexed week-in-month for a Date
   * @param d the Date to get the week for
   */
  private getWeekForDate(d: Date, firstWeekLength: number): number {
    const date = d.getDate();

    if (date < firstWeekLength) {
      return 0;
    }

    return Math.ceil((date - firstWeekLength) / 7);
  }

  /**
   * Gets a new Date representing the last date in a month
   * @param d a Date in the month of interest
   */
  private getLastDayOfMonth(d: Date): Date {
    const lastOfMonth = new Date(d);
    // get last date by setting date to 0 of next month
    if (lastOfMonth.getMonth() === 11) {
      // roll over to new year
      lastOfMonth.setFullYear(lastOfMonth.getFullYear() + 1, 0, 0);
    } else {
      // regular method
      lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);
    }
    return lastOfMonth;
  }

  /**
   * returns a new Date in the month prior to the supplied date
   * @param d a date in the month after the returned Date
   */
  private getPreviousMonth(d: Date): Date {
    const currentMonth = d.getMonth();
    let t: number;
    if (currentMonth === 0) {
      t = d.setFullYear(d.getFullYear() - 1, 11);
    } else {
      t = d.setMonth(currentMonth - 1);
    }
    return new Date(t);
  }

  /**
   * returns a new Date in the month after the supplied date
   * @param d a date in the month before the returned date
   */
  getNextMonth(d: Date): Date {
    const currentMonth = d.getMonth();
    let t: number;
    if (currentMonth === 11) {
      t = d.setFullYear(d.getFullYear() + 1, 0);
    } else {
      t = d.setMonth(currentMonth + 1);
    }
    return new Date(t);
  }
}
