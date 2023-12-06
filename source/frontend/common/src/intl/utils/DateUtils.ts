import { IntlUtils } from '@common/intl';
import {
  isValid,
  differenceInMonths,
  isPast,
  isThisWeek,
  isToday,
  isThisMonth,
  isAfter,
  isBefore,
  isEqual,
  format,
  parseISO,
  fromUnixTime,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
} from 'date-fns';
import { enGB, enUS, fr, ar } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';

// Map locale string (from i18n) to locale object (from date-fns)
const getLocaleObj = { fr, ar };

export const MINIMUM_EXPIRY_MONTHS = 3;

const dateInputHandler = (date: Date | string | number): Date => {
  // Assume a string is an ISO date-time string
  if (typeof date === 'string') return parseISO(date);
  // Assume a number is a UNIX timestamp
  if (typeof date === 'number') return fromUnixTime(date);
  return date as Date;
};

export const DateUtils = {
  getDateOrNull: (date: string | null): Date | null => {
    if (!date) return null;
    const maybeDate = new Date(date);
    return isValid(maybeDate) ? maybeDate : null;
  },
  isExpired: (expiryDate: Date): boolean => isPast(expiryDate),
  isAlmostExpired: (
    expiryDate: Date,
    threshold = MINIMUM_EXPIRY_MONTHS
  ): boolean => differenceInMonths(expiryDate, Date.now()) <= threshold,
  isThisWeek,
  isToday,
  isThisMonth,
  isAfter,
  isBefore,
  isEqual,
  isValid,
};

export const useFormatDateTime = () => {
  const language = IntlUtils.useCurrentLanguage();
  const locale =
    language === 'en'
      ? navigator.language === 'en-US'
        ? enUS
        : enGB
      : getLocaleObj[language];

  const localisedDate = (date: Date | string | number): string =>
    format(dateInputHandler(date), 'P', { locale });

  const localisedTime = (date: Date | string | number): string =>
    format(dateInputHandler(date), 'p', { locale });

  const dayMonthShort = (date: Date | string | number): string =>
    format(dateInputHandler(date), 'dd MMM', { locale });

  const dayMonthYearShort = (date: Date | string | number): string =>
    format(dateInputHandler(date), 'dd MMM yyyy', { locale });

  const dayMonthYearHourMinute = (date: Date | string | number): string =>
    format(dateInputHandler(date), 'dd MMM yyyy HH:mm', { locale });

  const daysAgo = (date: Date): number => {
    const now = new Date();
    return differenceInDays(now, date);
  };

  const daysUntil = (date: Date): number => {
    const now = new Date();
    return differenceInDays(date, now);
  };

  const hoursUntil = (date: Date): number => {
    const now = new Date();
    return differenceInHours(date, now);
  };

  const minutesMinusHoursUntil = (date: Date): number => {
    const now = new Date();
    const hours = differenceInHours(date, now);
    return differenceInMinutes(date, now) - hours * 60;
  };

  const localisedDistanceToNow = (date: Date | string | number) => {
    const d = dateInputHandler(date);
    return isValid(d) ? formatDistanceToNow(d, { locale }) : '';
  };

  const customDate = (
    date: Date | string | number,
    formatString: string
  ): string => format(dateInputHandler(date), formatString, { locale });

  // Add more date/time formatters as required

  return {
    localisedDate,
    localisedTime,
    dayMonthShort,
    dayMonthYearShort,
    daysAgo,
    daysUntil,
    customDate,
    dayMonthYearHourMinute,
    hoursUntil,
    minutesMinusHoursUntil,
    localisedDistanceToNow,
  };
};
