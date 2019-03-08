import { SelectAllDirective } from './select-all.directive';

describe('SelectAllDirective', () => {
  let el;
  beforeEach(() => {
    el = {
      nativeElement: {
        select: jasmine.createSpy()
      }
    };
  });

  it('should create an instance', () => {
    const directive = new SelectAllDirective(el);
    expect(directive).toBeTruthy();
  });

  it('should select all input on focus', () => {
    const directive = new SelectAllDirective(el);
    directive.onFocus();
    expect(el.nativeElement.select).toHaveBeenCalled();
  });
});
