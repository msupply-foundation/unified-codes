// "import type" ensures en messages aren't bundled by default
import { TypeOptions } from 'react-i18next';
import * as host from './en/host.json';
import * as common from './en/common.json';
import * as system from './en/system.json';

// Normalize single namespace
type WithOrWithoutPlural<K> = TypeOptions['jsonFormat'] extends 'v4'
  ? K extends unknown
    ? K extends `${infer B}_${
        | 'zero'
        | 'one'
        | 'two'
        | 'few'
        | 'many'
        | 'other'}`
      ? B | K
      : K
    : never
  : K;

export type LocaleKey =
  | WithOrWithoutPlural<keyof typeof host>
  | WithOrWithoutPlural<keyof typeof system>
  | WithOrWithoutPlural<keyof typeof common>;
