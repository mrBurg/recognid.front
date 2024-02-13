import React, { ReactElement, useCallback } from 'react';

import { DeveloperMenu } from '@component/developer/DeveloperMenu';
import { URIS } from '@root/routes';

import { TAppPropsWithLayout } from './@types';

function Layout(props: TAppPropsWithLayout) {
  const { Component, pageProps } = props;
  const getLayout =
    Component.getLayout || ((children: ReactElement) => children);

  const renderDeveloperMenu = useCallback(() => {
    if (process.env.ENVIRONMENT == 'development') {
      return <DeveloperMenu routes={URIS} />;
    }
  }, []);

  return (
    <>
      {renderDeveloperMenu()}
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export { Layout };
