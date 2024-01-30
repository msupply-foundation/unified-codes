import React, { FC } from 'react';
import { useFormatDateTime } from '@common/intl/utils/DateUtils';

export interface RelativeTimeDateProps {
  d: string | number | Date | null | undefined;
}

export const RelativeTimeDate: FC<RelativeTimeDateProps> = ({ d }) => {
  const { dayMonthYearHourMinute, localisedDistanceToNow } =
    useFormatDateTime();

  if (!d) {
    return null;
  }

  if (typeof d === 'string') {
    d = new Date(d);
  }

  return (
    <>
      {dayMonthYearHourMinute(d)} ({localisedDistanceToNow(d)} ago)
    </>
  );
};
