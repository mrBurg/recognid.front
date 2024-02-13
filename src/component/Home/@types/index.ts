import { TJSON } from '@interface/common';
import { TPageProps } from '@interface/page';

export type THomeProps = Record<'requestData' | 'staticData', TJSON>;

export type THomePageProps = TPageProps & THomeProps;
