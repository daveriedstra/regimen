import { MatchValidator } from './match-validator.directive';
import { FormGroup, FormControl } from '@angular/forms';

describe('MatchValidator', () => {
  let form: FormGroup,
    other: FormControl,
    self: FormControl;

  beforeEach(() => {
    other = new FormControl();
    self = new FormControl();
    form = new FormGroup({
      password: other,
      confirmPassword: self
    });
  });

  it('should create an instance', () => {
    const directive = new MatchValidator('pass');
    expect(directive).toBeTruthy();
  });

  it('should return errors if inputs don\'t match', () => {
    other.setValue('asdf123');
    self.setValue(`not ${other.value}`);
    const directive = new MatchValidator('password');

    const retVal = directive.validate(self);
    expect(retVal).toBeTruthy();
  });

  it('should not return errors if inputs match', () => {
    other.setValue('asdf123');
    self.setValue(other.value);
    const directive = new MatchValidator('password');

    const retVal = directive.validate(self);
    expect(retVal).toBeNull();
  });

});
