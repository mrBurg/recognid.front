import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { /* useEffect, */ useMemo } from 'react';

import { Preloader } from '@component/Preloader';
import { Facetec, FLOW } from '@component/Facetec';
import { TConfigGetProps } from '@component/Facetec/@types';
import { API_URIS, URIS } from '@root/routes';
import { makeUrl } from '@root/utils';

function FacetecPage() {
  const router = useRouter();
  const query = useMemo(() => router.query as TConfigGetProps, [router.query]);

  /* useEffect(() => {
    if (_.size(query)) {
      router.push(
        {
          pathname: '/liveness',
        },
        null,
        { shallow: true }
      );

      console.log(query);
    }
  }, [query, router]); */

  if (_.size(query)) {
    // if (process.env.ENVIRONMENT == 'development') {
    console.log(
      `%cAssembly Version %c${process.env.DEPLOY_TIME}`,
      'background: #bada55; color: #222; padding: 0 0.5em;',
      'background: #bada55; color: #222; font-weight: bold;'
    );

    console.log(`${process.env.APP_NAME} initialized`);

    // }

    return (
      <Facetec
        flow={FLOW.ID_MATCH}
        config={query}
        paths={{
          staticRoot: '/liveness-static/facetec',
          getConfig: makeUrl(process.env.DOMAIN, API_URIS.GET_CONFIG),
          /* getConfig: makeUrl(
            process.env.DEVELOPMENT_HTTP_SERVER,
            API_URIS.GET_CONFIG
          ), */
          enrollmentUpload: makeUrl(
            process.env.DOMAIN,
            API_URIS.ENROLLMENT_UPLOAD
          ),
          idScanUpload: makeUrl(process.env.DOMAIN, API_URIS.IDSCAN_UPLOAD),
          statusUpload: makeUrl(process.env.DOMAIN, API_URIS.STATUS_UPLOAD),
          auditTrailPath: URIS.RESPONSE_DEMO,
        }}
        preloader={<Preloader />}
      />
    );
  }

  return <Preloader />;
}

export default FacetecPage;
