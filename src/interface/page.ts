import { TJSON } from './common';

type TDomains = Record<'domain' | 'defaultLocale', string> &
  Record<'locales', string[]>;

export type TPageProps = Record<
  'context',
  Record<'locales', string[]> &
    Record<'defaultLocale', string> &
    Record<'domains', TDomains[]>
> &
  Record<'staticData', TJSON>;
