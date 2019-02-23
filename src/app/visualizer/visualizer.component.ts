import { Component, OnInit, AfterContentInit, Input, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import generateDummyData from './generateDummyData';
import DateEntries from '../models/date-entries.interface';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit, AfterContentInit, OnChanges {
  @Input()
  data: DateEntries[]; // = generateDummyData();

  today = new Date();
  weekdays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

  width = 3000;
  height = 1000;
  datumPadding = 50;
  firstWeekLength: number;

  colWidth = this.width / 7;
  rowWidth = this.height / 5;
  datumRadius = Math.min(this.colWidth, this.rowWidth) / 2 - this.datumPadding;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.data) {
      this.firstWeekLength = this.getFirstWeekLength(this.data);
      this.initD3();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.data = this.ensureDataHasToday(this.data);
    }
  }

  initD3() {
    const maxDuration = this.data.map(e => e.totalDuration)
      .reduce((prev, cur) => Math.max(prev, cur), 0);
    const svg = d3.select('.visualizer-content');

    const dates = svg.append('g')
      .selectAll('g')
      .data(this.data)
      .join('g');

    // all data
    dates.append('circle')
      .attr('r', this.datumRadius)
      .attr('cx', d => this.getEntryXPos(d))
      .attr('cy', d => this.getEntryYPos(d))
      .attr('fill-opacity', (d: DateEntries) => d.totalDuration / maxDuration);

    // today indicator
    dates.filter((d: DateEntries) => d.date.getDate() === this.today.getDate())
        .attr('class', d => {
          const isDark = d.totalDuration / maxDuration > 0.4;
          return isDark ? 'today today--dark' : 'today';
        })
      .append('circle')
        .attr('r', this.datumRadius - 0.3 * this.datumRadius)
        .attr('cx', d => this.getEntryXPos(d))
        .attr('cy', d => this.getEntryYPos(d))
        .attr('class', 'indicator');

    // out-of-month indicators
    const preDates = 7 - this.firstWeekLength;

    const lastOfMonth = new Date(this.data[0].date);
    // get last date by setting date to 0 of next month
    if (lastOfMonth.getMonth() === 11) {
      // roll over to new year
      lastOfMonth.setFullYear(lastOfMonth.getFullYear() + 1, 0, 0);
    } else {
      // regular method
      lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);
    }
    const postDates = 6 - lastOfMonth.getDay();

    svg.append('rect')
      .attr('class', 'pre-dates')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 25)
      .attr('ry', 25)
      .attr('width', this.colWidth * preDates)
      .attr('height', this.rowWidth);

    svg.append('rect')
      .attr('class', 'post-dates')
      .attr('x', this.colWidth * (lastOfMonth.getDay() + 1))
      .attr('y', this.height - this.rowWidth)
      .attr('rx', 25)
      .attr('ry', 25)
      .attr('width', this.colWidth * postDates)
      .attr('height', this.rowWidth);
  }

  /**
   * Gets the length of the first week (in days)
   * of the month in which the provided entries fall
   * @param data list of entries to check
   */
  private getFirstWeekLength(data: DateEntries[]): number {
    const firstWeekday = new Date(data[0].date);
    firstWeekday.setDate(1);

    return 7 - firstWeekday.getDay();
  }

  /**
   * Gets the 0-indexed week-in-month for a Date
   * @param d the Date to get the week for
   */
  private getWeekForDate(d: Date): number {
    const date = d.getDate();

    if (date < this.firstWeekLength) {
      return 0;
    }

    return Math.ceil((date - this.firstWeekLength) / 7);
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
  private getEntryYPos(e: DateEntries): number {
    return this.getWeekForDate(e.date) * this.rowWidth + (0.5 * this.rowWidth);
  }

  /**
   * Ensures that the data has a datapoint representing today,
   * even if there is no data for today
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
}
