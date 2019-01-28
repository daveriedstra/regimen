import { MaxValidator } from './max-validator.directive';
import { AbstractControl } from '@angular/forms';

describe('MaxValidator', () => {
  it('should create an instance', () => {
    const directive = new MaxValidator('0');
    expect(directive).toBeTruthy();
  });

  it('should return errors if amount is greater than max', () => {
    const max = 10,
      test = 11;
    const v = new MaxValidator(`${max}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).not.toBeNull();
  });

  it('should return null if amount is less than max', () => {
    const max = 10,
      test = 9;
    const v = new MaxValidator(`${max}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).toBeNull();
  });

  it('should return null if amount is equal to max', () => {
    const max = 10,
      test = 10;
    const v = new MaxValidator(`${max}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).toBeNull();
  });
});
