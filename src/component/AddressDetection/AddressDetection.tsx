import _ from 'lodash';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { API_URIS } from '@root/routes';
import { makeUrl } from '@root/utils';
import { TAddressGetProps, TChangeEvent } from './@types';
import { Preloader } from '@component/Preloader';

function AddressDetection() {
  const addFileHandler = useCallback(async (event: TChangeEvent) => {
    const { files } = event.target;

    if (files) {
      const formData = new FormData();

      _.each(files, (item) => {
        formData.append('file', item);
        formData.append('filename', encodeURI(item.name));
      });

      try {
        const response = await axios.post(
          makeUrl(process.env.DOMAIN, API_URIS.UPLOAD_DOCUMENT)
        );

        if (response.status == 200) {
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <div>
      <input type={'file'} onChange={(event) => addFileHandler(event)} />
    </div>
  );
}

export { AddressDetection };

function AddressDetectionResult() {
  const router = useRouter();

  const query = useMemo(() => router.query as TAddressGetProps, [router.query]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          makeUrl(process.env.DOMAIN, API_URIS.ADDRESS),
          {
            params: query,
          }
        );

        if (response.status == 200) {
          console.log(response.data);

          return response.data;
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInfo()
      .then((data) => {
        if (data) {
          return setData(true);
        }

        return;
      })
      .catch((err) => console.log(err));
  }, [query, router]);

  const sendResult = useCallback(async () => {
    try {
      const response = await axios.post(
        makeUrl(process.env.DOMAIN, API_URIS.ADDRESS_RESULT)
      );

      if (response.status == 200) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (data) {
    return (
      <div>
        <button type={'button'} onClick={() => sendResult()}>
          {'Button'}
        </button>
      </div>
    );
  }

  return <Preloader />;
}

export { AddressDetectionResult };
