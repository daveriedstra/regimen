import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyDuration'
})
export class PrettyDurationPipe implements PipeTransform {

  transform(value: number | string, args?: any): string {
    value = +value;
    const hours =  Math.trunc(value / 3600);
    const mins = (value / 60) % 60;
    let hoursStr = `${hours} hour`;
    let minsStr = `${mins} minute`;

    if (hours > 1) {
      hoursStr += 's';
    }

    if (mins > 1) {
      minsStr += 's';
    }

    if (hours !== 0 && mins !== 0) {
      return `${hoursStr} ${minsStr}`;
    } else if (mins === 0) {
      return hoursStr;
    } else {
      return minsStr;
    }
  }

}
