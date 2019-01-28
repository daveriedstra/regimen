import { NewlinePipe } from './newline.pipe';

describe('NewlinePipe', () => {
  it('create an instance', () => {
    const pipe = new NewlinePipe();
    expect(pipe).toBeTruthy();
  });

  it('replaces all newlines with <br>', () => {
    const test = `one
      two
      three`;
    const res = (new NewlinePipe).transform(test);
    expect(res).not.toContain('\r');
    expect(res).toContain('<br');
  });
});
