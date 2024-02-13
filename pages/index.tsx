import _ from 'lodash';
import { GetStaticPropsContext } from 'next';
import React, { ReactElement } from 'react';
import Head from 'next/head';

import { Home } from '@component/Home';
import { Preloader } from '@component/Preloader';
import { THomePageProps } from '@component/Home/@types';

function HomePage(props: THomePageProps) {
  const { staticData, requestData } = props;

  if (_.isPlainObject(staticData) && _.isPlainObject(requestData)) {
    return <Home staticData={props.staticData} requestData={requestData} />;
  }

  return <Preloader />;
}

HomePage.getLayout = (children: ReactElement) => {
  const { staticData } = children.props;

  return (
    <>
      <Head>
        <title>{staticData.title}</title>
      </Head>
      {children}
    </>
  );
};

export default HomePage;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      context,
      staticData: {
        title: 'RecognID',
        button: 'Click for start RecognID Application',
      },
      requestData: {
        request_id: 'Test_Lit_1',
        return_url: 'https://recid.finmdtest.com?resp',
        webhook_url:
          'https://mockbin.org/bin/a6de0afa-db4d-4f52-9c95-da88cdcd15e6?oper=webhook_url',
        stages: ['LivenessDetection', 'IDDocVerification', 'WatchlistsCheck'],
        language: 'ro',
      },
    },
  };
}
