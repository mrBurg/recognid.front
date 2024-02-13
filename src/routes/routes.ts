// URL [protocol:]//[domain]/[path]
// URN [domain]/[path]
// URI /[path]

export enum URIS {
  ROOT = '/',
  AUDIT_TRAIL = '/audit-trail',
  RESPONSE_DEMO = '/response-demo',
  LIVENESS = '/liveness',
  PROCESSING = '/processing',
  ADDRESS_DETECTION = '/address-detection',
  ADDRESS_DETECTION_RESULT = '/address-detection-result',
}

export enum API_URIS {
  PROCESSING = '/api/operation/check',
  UPLOAD_DOCUMENT = '/api/operation/',
  ADDRESS = '/api/operation/address',
  ADDRESS_RESULT = '/api/operation/addressResult',
  ENROLLMENT_UPLOAD = '/api/operation/enrollment-3d',
  IDSCAN_UPLOAD = '/api/operation/match-3d-2d-idscan',
  STATUS_UPLOAD = '/api/operation/liveness-status',
  GET_CONFIG = '/api/operation/config',

  // только для локальной разработки
  GET_LINK = '/api/config/getLink',
  OPERATION_INIT = '/api/operation/init',
  CHECK = '/api/operation/check',

  SESSION_RESULT = '/api/facetec/sessionResult',
  ID_SCAN_RESULT = '/api/facetec/IDScanResult',
  DOCUMENT_DATA = '/api/facetec/documentData',
}
