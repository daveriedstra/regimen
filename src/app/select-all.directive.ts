import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSelectAll]',
})
export class SelectAllDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.select();
  }
}
