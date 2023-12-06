import { StringUtils } from './StringUtils';

describe('StringUtils', () => {
  it('Should capitalize sentence', () => {
    expect(StringUtils.capitalize('This is a test string')).toEqual(
      'This Is A Test String'
    );
  });
  it('Capitalizes string with non-default delimeter', () => {
    expect(StringUtils.capitalize('this-is-a-test-string', '-')).toEqual(
      'This Is A Test String'
    );
  });
  it("Shouldn't capitalize sentence", () => {
    expect(StringUtils.capitalize('This is a test string', '-')).not.toEqual(
      'This Is A Test String'
    );
  });
});
