/* declare const FaceTecSDK: typeof import('./facetec/FaceTecSDK').FaceTecSDK; */

declare module 'get-random-values' {
  export default function getRandomValues(data: any): any;
}

declare interface Window {
  RecognID: Record<
    'appName' | 'appVersion' | 'deployTime' | 'sdkVersion',
    string
  >;
}
