import axios from 'axios';
import Script from 'next/script';
import React, { useCallback, useEffect, useState } from 'react';

// import { View } from './View';
import { Controller } from './controllers';
import { Config } from './config/Config';
import { TConfigProps, TFacetecProps } from './@types';
import { jsonToQueryString, SCRIPT_STRATEGY } from '@root/utils';

export enum FLOW {
  ENROLL, // Enroll User,
  ID_MATCH, // Photo ID Match
}

function Facetec(props: TFacetecProps) {
  const { paths } = props;

  const [faceTecSDK, setFaceTecSDK] = useState(null as typeof FaceTecSDK);
  const [controller, setController] = useState(null as Controller);
  // const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (faceTecSDK) {
      window.RecognID = {
        appName: process.env.APP_NAME,
        appVersion: process.env.APP_VERSION,
        deployTime: process.env.DEPLOY_TIME,
        sdkVersion: FaceTecSDK.version(),
      };

      const { config, paths, ...restProps } = props;

      const getFacetecConfig = () =>
        axios.get(
          `${paths.getConfig}/field${jsonToQueryString({ key: 'facetec' })}`,
          { params: { id: config.id } }
        );

      const getDowntimeConfig = () =>
        axios.get(`${paths.getConfig}/timeout`, { params: { id: config.id } });

      const getLocaleConfig = () =>
        axios.get(`${paths.getConfig}/file/${config.partner}`, {
          params: { id: config.id },
        });

      const getConfig = () =>
        Promise.all([
          getFacetecConfig(),
          getDowntimeConfig(),
          getLocaleConfig(),
        ]);

      getConfig()
        .then((data) => {
          const [facetecResponse, downtimeResponse, localeResponse] = data;

          if (facetecResponse.status == 200) {
            const { data } = facetecResponse;

            const facetecConfig = {
              ProductionKey: data.value.production_key,
              DeviceKeyIdentifier: data.value.device_key,
              PublicFaceScanEncryptionKey: data.value.ssh_public_key,
              paths: {
                ...paths,
                base_url: data.value.base_url,
              },
              theme: {
                overlayCustomization: {
                  brandingImage: `${paths.getConfig}/logo/${
                    config.partner
                  }${jsonToQueryString({ id: config.id })}`,
                },
              },
            } as TConfigProps;

            if (downtimeResponse.status == 200) {
              facetecConfig.downtime = downtimeResponse.data;
            }

            if (localeResponse.status == 200) {
              facetecConfig.locale = localeResponse.data;
            }

            const cfg = new Config(
              faceTecSDK,
              Object.assign({}, restProps, config, facetecConfig)
            );

            setController(
              new Controller(
                cfg /* {
                setInitialized,
              } */
              )
            );
          }

          return;
        })
        .catch((err) => console.log(err));
    }
  }, [faceTecSDK, props]);

  const renderFacetec = useCallback(() => {
    if (controller) {
      // Start For local development
      // <View initialized={initialized} controller={controller} />;
      //End

      return props.preloader;
    }

    return props.preloader;
  }, [controller, props.preloader]);

  return (
    <>
      <Script
        strategy={SCRIPT_STRATEGY.AFTERINTERACTIVE}
        src={`${paths.staticRoot}/FaceTecSDK.js`}
        onLoad={() => setFaceTecSDK(FaceTecSDK)}
      />
      {renderFacetec()}
    </>
  );
}

export { Facetec };
