import React from 'react';
import { Layout } from '@component/Layout';
import { TAppPropsWithLayout } from '@component/Layout/@types';

import 'normalize';
import '@scss/index.scss';

function App(props: TAppPropsWithLayout) {
  return <Layout {...props} />;
}

export default App;
