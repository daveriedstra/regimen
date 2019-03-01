import {
  Component,
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
export class VisualizerComponent implements OnChanges {
  @Input()
  data: DateEntries[];

  @Output()
  dateSelected = new EventEmitter();

  @Output()
  prevMonth = new EventEmitter();

  @Output()
  nextMonth = new EventEmitter();

  today = new Date();
  stagedMonth = new Date();
  weekdays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

  width = 3000;
  height = 1000;
  datumPadding = 50;

  colWidth = this.width / 7;
  rowWidth = this.height / 5;
  datumRadius = Math.min(this.colWidth, this.rowWidth) / 2 - this.datumPadding;

  transitionDuration = 250;
  transitionEasing = d3.easeSinInOut;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.draw(changes['data'].currentValue);
    }
  }

  onPrevMonth() {
    this.stagedMonth = this.getPreviousMonth(this.stagedMonth);
    this.prevMonth.emit(this.stagedMonth.getMonth());
  }

  onNextMonth() {
    this.stagedMonth = this.getNextMonth(this.stagedMonth);
    this.nextMonth.emit(this.stagedMonth.getMonth());
  }

  onDateClick(d: DateEntries) {
    if (d.entries.length > 0) {
      this.dateSelected.emit(d);
    }
  }

  /**
   * Draws the calendar data visualization
   */
  draw(data: DateEntries[]) {
    const svg = d3.select('.visualizer-content');
    const displayedData = data.filter(d => {
      return (
        d.date.getMonth() === this.stagedMonth.getMonth()
        &&
        d.date.getFullYear() === this.stagedMonth.getFullYear()
      );
    });
    const todayDate = this.today.getDate();
    const todayData = displayedData.find(d => {
      const isToday = d.date.getDate() === todayDate;
      return isToday && !d.isTodayMarker;
    });
    const maxDuration = displayedData.map(e => e.totalDuration)
      .reduce((prev, cur) => Math.max(prev, cur), 0);
    const firstWeekLength = this.getFirstWeekLength(this.stagedMonth);

    this.renderDates({ svg, displayedData, firstWeekLength, maxDuration });
    this.renderTodayMarker({ svg, todayData, firstWeekLength, maxDuration });
    this.renderBounds({ svg, firstWeekLength });
  }

  /**
   * Renders the date entry data
   */
  private renderDates({ svg, displayedData, firstWeekLength, maxDuration }) {
    const transition = this.getTransition();

    svg.select('.dates')
      .selectAll('g')
      .data(displayedData)
      .join(
        enter => {
          const g = enter.append('g')
            .on('click', this.onDateClick.bind(this));
          g.append('circle')
            .classed('date', true)
            .attr('r', this.datumRadius)
            .attr('cx', d => this.getEntryXPos(d))
            .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
            .attr('fill-opacity', d => d.totalDuration / maxDuration);

          g.append('circle')
            .attr('r', 2 * this.datumRadius)
            .attr('cx', d => this.getEntryXPos(d))
            .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
            .classed('click-target', true);

          this.fadeIn(g, transition);
        },
        update => {
          update.select('circle.date')
            .transition(transition)
              .attr('cx', d => this.getEntryXPos(d))
              .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
              .attr('fill-opacity', d => d.totalDuration / maxDuration);
          update.select('circle.click-target')
            .attr('cx', d => this.getEntryXPos(d))
            .attr('cy', d => this.getEntryYPos(d, firstWeekLength));
        },
        exit => {
          this.fadeOutAndRemove(exit, transition);
        }
      );
  }

  /**
   * Renders the today marker
   */
  private renderTodayMarker({ svg, todayData, firstWeekLength, maxDuration }) {
    const inMonth = (
      this.stagedMonth.getMonth() === this.today.getMonth()
      &&
      this.stagedMonth.getFullYear() === this.today.getFullYear()
    );

    const todayMarker = [{
      date: new Date(),
      totalDuration: 0,
      entries: [],
      isTodayMarker: true
    }].filter(d => inMonth);

    const transition = this.getTransition();

    svg.selectAll('circle.today')
      .data(todayMarker)
      .join(
        enter => {
          const circle = enter.append('circle')
            .attr('r', this.datumRadius - 0.3 * this.datumRadius)
            .attr('cx', d => this.getEntryXPos(d))
            .attr('cy', d => this.getEntryYPos(d, firstWeekLength))
            .classed('today date', true)
            .classed('today--empty', d => !todayData || todayData.totalDuration < 1)
            .classed('today--dark', d => !!todayData && todayData.totalDuration / maxDuration > 0.4)
            .on('click', this.onDateClick.bind(this, todayData));
          this.fadeIn(circle, transition);
        },
        update => {}, // never updated; only added or removed
        exit => {
          this.fadeOutAndRemove(exit, transition);
        }
      );
  }

  /**
   * Renders the boundaries of the month (and non-month-days)
   */
  private renderBounds({ svg, firstWeekLength }) {
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
   * Generates a new d3 transition
   */
  private getTransition(): d3.Transition<HTMLElement, {}, null, undefined> {
    return d3.transition()
      .duration(this.transitionDuration)
      .ease(this.transitionEasing);
  }

  /**
   * Adds a fade-in transition to an element.
   *
   * @param el d3 selection to add the transition to
   * @param t the transition to add
   * @returns applied d3 transition
   */
  private fadeIn(
    el: d3.Selection<HTMLElement, any, any, any>,
    t: d3.Transition<HTMLElement, any, any, any>
  ): d3.Transition<HTMLElement, any, any, any> {
    return el.attr('opacity', 0)
      .transition(t)
      .attr('opacity', 1);
  }

  /**
   * Adds a fade-out transition to an element and
   * removes the element after the transition completes.
   *
   * @param el d3 selection to add the transition to
   * @param t the transition to add
   * @returns applied d3 transition
   */
  private fadeOutAndRemove(
    el: d3.Selection<HTMLElement, any, any, any>,
    t: d3.Transition<HTMLElement, any, any, any>
  ): d3.Transition<HTMLElement, any, any, any> {
    return el.transition(t)
      .attr('opacity', 0)
      .on('end', () => el.remove());
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
    lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);
    return lastOfMonth;
  }

  /**
   * returns a new Date in the month prior to the supplied date
   * @param d a date in the month after the returned Date
   */
  private getPreviousMonth(d: Date): Date {
    const prevMonth = new Date(d);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth;
  }

  /**
   * returns a new Date in the month after the supplied date
   * @param d a date in the month before the returned date
   */
  private getNextMonth(d: Date): Date {
    const nextMonth = new Date(d);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  }
}
