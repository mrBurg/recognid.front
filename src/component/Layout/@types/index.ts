import { /* GetStaticPropsContext, */ NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';

type TNextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

export type TAppPropsWithLayout = AppProps &
  Record<'Component', TNextPageWithLayout> &
  Record<
    'pageProps',
    Record<string, unknown> /* & Record<'context', GetStaticPropsContext> */
  >;
