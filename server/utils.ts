import { networkInterfaces, NetworkInterfaceInfo } from 'os';
import _ from 'lodash';
import getRandomValues from 'get-random-values';

import cfg from './config.json';

export function getNetworkInterface() {
  const interfaces = networkInterfaces();
  const results = {};

  for (const [name, value] of Object.entries(interfaces)) {
    for (const {
      family,
      internal,
      address,
    } of value as NetworkInterfaceInfo[]) {
      if (family === cfg.versionIP && !internal) {
        if (!results[name]) {
          results[name] = [];
        }

        results[name].push(address);
      }
    }
  }

  return results;
}

export const serverCallback = ((err) => (protocol: string, port: number) => {
  const wrapper = (data: string) =>
    `\n    \x1b[102m\x1b[30m${data}\x1b[0m\x1b[92m`;
  const hostsData = getNetworkInterface();
  let hosts = `${wrapper('["localhost"]')}`;

  if (err) {
    throw err;
  }

  for (const item in hostsData) {
    hosts += `${wrapper(JSON.stringify(hostsData[item]))}\x1b[0m\t ${item}`;
  }

  console.log(
    `\x1b[92m${protocol} App ready on =>\n  host ->${hosts}\n\x1b[92m  port ->${wrapper(
      `["${port}"]`
    )}\n\x1b[0m`
  );

  return _.noop;
})();

export function generateUUId() {
  return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

export function jsonToQueryString(
  json: Record<string, unknown>,
  ...restProps: (boolean | string)[]
) {
  let encode = false;
  let symbol = '?';

  _.each(restProps, (item) => {
    switch (true) {
      case _.isBoolean(item):
        encode = item as boolean;

        break;
      case _.isString(item):
        symbol = item as string;

        break;
    }
  });

  return (
    symbol +
    _.map(json, (value: string, key: string) => {
      if (!value) {
        return false;
      }

      if (encode) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
      }

      return `${key}=${value}`;
    })
      .filter((value) => value)
      .join('&')
  );
}
