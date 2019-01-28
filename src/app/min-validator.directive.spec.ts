import { MinValidator } from './min-validator.directive';
import { AbstractControl } from '@angular/forms';

describe('MinValidator', () => {
  it('should create an instance', () => {
    const directive = new MinValidator('0');
    expect(directive).toBeTruthy();
  });

  it('should return errors if amount is less than min', () => {
    const min = 10,
      test = 9;
    const v = new MinValidator(`${min}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).not.toBeNull();
  });

  it('should return null if amount is greater than min', () => {
    const min = 10,
      test = 11;
    const v = new MinValidator(`${min}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).toBeNull();
  });

  it('should return null if amount is equal to min', () => {
    const min = 10,
      test = 10;
    const v = new MinValidator(`${min}`);
    const retVal = v.validate({
      value: test
    } as AbstractControl);

    expect(retVal).toBeNull();
  });

});
