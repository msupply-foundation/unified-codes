import { LocaleKey, TypedTFunction } from '@common/intl';
import { Formatter } from '@common/utils';
import { UserAccountRowFragment } from './api';

export const userAccountsToCsv = (
  invoices: UserAccountRowFragment[],
  t: TypedTFunction<LocaleKey>
) => {
  const fields: string[] = [
    'id',
    t('label.username'),
    t('label.name'),
    t('label.email'),
  ];

  const data = invoices.map(node => [
    node.id,
    node.username,
    node.displayName,
    node.email,
  ]);
  return Formatter.csv({ fields, data });
};
