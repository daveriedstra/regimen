import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[max]',
  providers: [
    {
      provide: NG_VALIDATORS, 
      useExisting: forwardRef(() => MaxValidator),
      multi: true
    }
  ]
})
export class MaxValidator implements Validator {

  constructor(@Attribute('max') private max: string) { }

  validate(ctl: AbstractControl): ValidationErrors {
    if (+ctl.value <= +this.max) {
      return null;
    }

    return { max: true };
  }

}
