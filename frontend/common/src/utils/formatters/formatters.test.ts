import { Formatter } from './formatters';

describe('Formatter', () => {
  it('is defined', () => {
    expect(Formatter.csv).toBeDefined();
    expect(Formatter.csvDateString).toBeDefined();
    expect(Formatter.expiryDate).toBeDefined();
    expect(Formatter.expiryDateString).toBeDefined();
    expect(Formatter.naiveDate).toBeDefined();
  });

  it('csvDateString', () => {
    expect(Formatter.csvDateString(null)).toBe('');
    expect(Formatter.csvDateString(undefined)).toBe('');
    expect(Formatter.csvDateString('bah')).toBe('');
    expect(Formatter.csvDateString('2022/03/30')).toBe('2022-03-30 00:00:00');
    expect(Formatter.csvDateString('2020/10/12 04:30')).toBe(
      '2020-10-12 04:30:00'
    );
  });

  it('expiryDate', () => {
    expect(Formatter.expiryDate(null)).toBe(null);
    expect(Formatter.expiryDate(new Date('2022/01/20'))).toBe('01/2022');
  });

  it('expiryDateString', () => {
    expect(Formatter.expiryDateString(null)).toBe('');
    expect(Formatter.expiryDateString('oops')).toBe('');
    expect(Formatter.expiryDateString('2022/01/20')).toBe('01/2022');
  });

  it('naiveDate', () => {
    expect(Formatter.naiveDate(null)).toBe(null);
    expect(Formatter.naiveDate(new Date('1984/3/13'))).toBe('1984-03-13');
  });
});
