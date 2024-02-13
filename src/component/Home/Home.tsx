import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useCallback } from 'react';

import style from './Home.module.scss';

import { THomeProps } from './@types';
import { API_URIS } from '@root/routes';
import { makeUrl, replaceString } from '@root/utils';
import { TOperationData } from '@component/Facetec/@types';

function Home(props: THomeProps) {
  const { staticData, requestData } = props;

  const router = useRouter();

  const getLink = useCallback(() => {
    const getOperation = async () => {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.AUTHORIZATION,
        },
      };

      try {
        const response = await axios.post(
          makeUrl(process.env.DOMAIN, API_URIS.OPERATION_INIT),
          requestData,
          options
        );

        if (response.status == 200) {
          return response.data;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getLivenessUrl = async (data: TOperationData) => {
      if (data) {
        try {
          const response = await axios.post(
            makeUrl(process.env.DEVELOPMENT_HTTP_SERVER, API_URIS.GET_LINK),
            data
          );

          if (response.status == 200) {
            return response.data as string;
          }
        } catch (err) {
          console.log(err);
          throw new Error(
            'You need to run the developer\u2019s server in a separate process. Execute the command "yarn :development" at the root of the project then try again'
          );
        }
      }

      return;
    };

    const initLiveness = (data: string) => {
      if (data) {
        return router.push(
          replaceString(data, process.env.DOMAIN, process.env.HTTPS_SERVER)
        );
      }

      return;
    };

    getOperation()
      .then(getLivenessUrl)
      .then(initLiveness)
      .catch((err) => console.log(err));
  }, [requestData, router]);

  return (
    <div className={style.container}>
      <button className={style.button} type="button" onClick={() => getLink()}>
        {staticData.button as string}
      </button>
    </div>
  );
}

export { Home };
