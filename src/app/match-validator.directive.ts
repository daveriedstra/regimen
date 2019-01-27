import { Directive, forwardRef, Attribute, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[match][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS, 
      useExisting: forwardRef(() => MatchValidator),
      multi: true
    }
  ]
})
export class MatchValidator implements Validator, OnDestroy {
  private otherCtlSub: Subscription;

  constructor(@Attribute('match') private otherCtlName: string) { }

  validate(self: AbstractControl): ValidationErrors {
    const selfVal = self.value;
    const otherCtl = self.root.get(this.otherCtlName);

    // a little flimsy, otherCtl could change
    if (otherCtl && !this.otherCtlSub) {
      this.otherCtlSub = otherCtl.valueChanges.subscribe(o => {
        self.updateValueAndValidity();
      });
    }

    if (otherCtl && selfVal === otherCtl.value) {
      return null;
    }

    return { match: true };
  }

  ngOnDestroy() {
    this.otherCtlSub.unsubscribe();
  }

}
