import _ from 'lodash';
import Router from 'next/router';

import { Config } from '../config/Config';
import { Controller } from '../controllers';
import {
  FaceTecFaceScanProcessor,
  FaceTecFaceScanResultCallback,
  FaceTecIDScanResultCallback,
  FaceTecSessionResult,
} from '../declarations/FaceTecPublicApi';
import { TLatestNetworkRequestParams } from '../@types/processors';
import { URIS } from '@root/routes';
import { jsonToQueryString, makeUrl } from '@root/utils';

export class Processor {
  success = false;
  latestSessionResult = null;
  latestNetworkRequest = new XMLHttpRequest();

  constructor(protected cfg: Config, protected controller: Controller) {
    new this.cfg.sdk.FaceTecSession(
      this as unknown as FaceTecFaceScanProcessor,
      this.cfg.session
    );
  }

  protected async prepareRequest(
    url: string,
    apiUserAgentString: string,
    parameters: TLatestNetworkRequestParams,
    callback: FaceTecIDScanResultCallback
  ) {
    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open('POST', url);

    const headers = {
      'Content-Type': 'application/json',
      // 'X-Device-Key': this.cfg.DeviceKeyIdentifier,
      'X-User-Agent':
        this.cfg.sdk.createFaceTecAPIUserAgentString(apiUserAgentString),
    };

    _.each(headers, (item, index) =>
      this.latestNetworkRequest.setRequestHeader(index, item)
    );

    this.latestNetworkRequest.onreadystatechange = async () => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        const processingUri = makeUrl(
          URIS.PROCESSING,
          jsonToQueryString({ id: parameters.operationId })
        );
        try {
          const responseJSON = JSON.parse(
            this.latestNetworkRequest.responseText
          );

          if (responseJSON.wasProcessed) {
            this.controller.reloadDowntime();
            callback.proceedToNextStep(responseJSON.scanResultBlob);
          } else {
            console.log('Finish. Check next stage');
            callback.cancel();

            Router.replace(processingUri);
          }
        } catch (err) {
          console.log('Check operation stage');
          console.log(err);
          callback.cancel();

          Router.replace(processingUri);
        }
      }
    };

    this.latestNetworkRequest.onerror = () => {
      console.log('XHR error, cancelling.');
      callback.cancel();
    };

    this.latestNetworkRequest.upload.onprogress = (event) =>
      callback.uploadProgress(event.loaded / event.total);

    this.latestNetworkRequest.send(JSON.stringify(parameters));
  }

  isSuccess() {
    return this.success;
  }

  processSessionResultWhileFaceTecSDKWaits(
    sessionResult: FaceTecSessionResult,
    callback: FaceTecFaceScanResultCallback
  ) {
    this.controller.reloadDowntime();
    this.latestSessionResult = sessionResult;

    if (
      sessionResult.status !==
      this.cfg.sdk.FaceTecSessionStatus.SessionCompletedSuccessfully
    ) {
      console.log(
        `Session was not completed successfully, cancelling with status: ${
          this.cfg.sdk.FaceTecSessionStatus[sessionResult.status]
        }`
      );

      this.controller.statusUpload({
        id: this.cfg.sdk.getStatus(),
        name: this.cfg.sdk.FaceTecSessionStatus[sessionResult.status],
        class: 'SessionStatus',
      });

      this.latestNetworkRequest.abort();
      callback.cancel();

      return;
    }

    const parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      operationId: this.cfg.id,
      sessionId: sessionResult.sessionId,
    } as TLatestNetworkRequestParams;

    this.prepareRequest(
      this.cfg.paths.enrollmentUpload,
      sessionResult.sessionId,
      parameters,
      callback
    );

    window.setTimeout(() => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        return;
      }

      callback.uploadMessageOverride('Still Uploading...');
    }, 6000);
  }
}
