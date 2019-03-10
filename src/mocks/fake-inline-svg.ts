import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[inlineSVG]'
})
export class FakeInlineSVGDirective {
  constructor() { }
  @Input()
  inlineSVG: string;
}
