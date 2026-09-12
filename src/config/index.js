import {NativeModules} from 'react-native';

const PRODUCTION_API_URL = 'https://api.money-mails.com/api/v1';
const PRODUCTION_BINGO_URL = 'https://bingo.money-mails.com/';

const normalizeApiUrl = value => {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return PRODUCTION_API_URL;
  }

  try {
    const url = new URL(rawValue);

    if (url.hostname === 'stage.money-mails.com') {
      url.hostname = 'stage-api.money-mails.com';
    } else if (url.hostname === 'money-mails.com') {
      url.hostname = 'api.money-mails.com';
    }

    url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString().replace(/\/$/, '');
  } catch (_error) {
    return rawValue.replace(/\/+$/, '');
  }
};

const DEFAULT_GOOGLE_WEB_CLIENT_ID =
  '982612649760-6p6p4ta4ll8gqumj4r0j4aqibv1vr6ke.apps.googleusercontent.com';

const unwrapConfig = value => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const nested = value.config;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    if (nested.GOOGLE_WEB_CLIENT_ID || nested.API_URL) {
      return nested;
    }
  }

  return value;
};

const readConfigValue = (config, key) => {
  const value = unwrapConfig(config)?.[key];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  return value || undefined;
};

const readFromCandidate = (candidate, key) => {
  if (!candidate) {
    return undefined;
  }

  if (typeof candidate.getConfig === 'function') {
    const fromNative = readConfigValue(candidate.getConfig(), key);
    if (fromNative) {
      return fromNative;
    }
  }

  return readConfigValue(candidate, key);
};

const getEnv = key => {
  try {
    const fromBridge = readFromCandidate(NativeModules?.RNCConfigModule, key);
    if (fromBridge) {
      return fromBridge;
    }
  } catch (_error) {
    // Fall through to the JS module, then to the debug default.
  }

  try {
    const ConfigModule = require('react-native-config');
    const candidates = [
      ConfigModule?.default,
      ConfigModule?.Config,
      ConfigModule,
    ];

    for (const candidate of candidates) {
      const value = readFromCandidate(candidate, key);
      if (value) {
        return value;
      }
    }
  } catch (_error) {
    return undefined;
  }

  return undefined;
};

const resolveGoogleWebClientId = () => {
  return getEnv('GOOGLE_WEB_CLIENT_ID') || DEFAULT_GOOGLE_WEB_CLIENT_ID;
};

const resolveAwsApiKey = () => {
  if (!__DEV__) {
    return '';
  }

  return getEnv('REACT_APP_AWS_API_KEY') || getEnv('AWS_API_KEY') || '';
};

export const API_URL = normalizeApiUrl(getEnv('API_URL'));
if (!__DEV__ && API_URL !== PRODUCTION_API_URL) {
  throw new Error('Release builds must use the production API.');
}
export const BINGO_URL =
  getEnv('BINGO_URL') || PRODUCTION_BINGO_URL;
export const GOOGLE_WEB_CLIENT_ID = resolveGoogleWebClientId();
export const GOOGLE_IOS_CLIENT_ID =
  getEnv('GOOGLE_IOS_CLIENT_ID') || '';
export const AWS_REGION =
  getEnv('REACT_APP_AWS_REGION') || getEnv('AWS_REGION') || 'us-east-1';
export const AWS_API_KEY = resolveAwsApiKey();
export const AWS_MAP_STYLE =
  getEnv('REACT_APP_AWS_MAP_STYLE') || getEnv('AWS_MAP_STYLE') || 'Standard';
