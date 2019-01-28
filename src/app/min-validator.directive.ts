import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[min]',
  providers: [
    {
      provide: NG_VALIDATORS, 
      useExisting: forwardRef(() => MinValidator),
      multi: true
    }
  ]
})
export class MinValidator implements Validator {

  constructor(@Attribute('min') private min: string) { }

  validate(ctl: AbstractControl): ValidationErrors {
    if (+ctl.value >= +this.min) {
      return null;
    }

    return { min: true };
  }

}
