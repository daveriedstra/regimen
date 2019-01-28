import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newline'
})
export class NewlinePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/\n/g, '<br />');
  }

}
