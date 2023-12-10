import { CurrencyUtils } from './CurrencyUtils';

describe('CurrencyUtils', () => {
  it('Should validate the correct codes', () => {
    expect(CurrencyUtils.validateCurrencyCode('USD')).toBe(true);
  });
  it('Should invalidate the incorrect codes', () => {
    expect(CurrencyUtils.validateCurrencyCode('AAA')).toBe(false);
  });
});
