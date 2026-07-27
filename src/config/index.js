const normalizeApiUrl = value => {
  const rawValue = String(value || '').trim();

  if (!rawValue) {
    return 'https://stage-api.money-mails.com/api/v1';
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

const getEnv = key => {
  try {
    // react-native-config is optional until native dependencies are installed.
    const ConfigModule = require('react-native-config');
    const Config =
      ConfigModule?.default?.config ||
      ConfigModule?.Config?.config ||
      ConfigModule?.default ||
      ConfigModule?.Config ||
      ConfigModule?.config ||
      ConfigModule;
    const value = Config?.[key];
    return typeof value === 'string' ? value.trim() : value;
  } catch (_error) {
    return undefined;
  }
};

const DEFAULT_GOOGLE_WEB_CLIENT_ID =
  '982612649760-6p6p4ta4ll8gqumj4r0j4aqibv1vr6ke.apps.googleusercontent.com';

export const API_URL = normalizeApiUrl(getEnv('API_URL'));
export const BINGO_URL =
  getEnv('BINGO_URL') || 'https://bingo.money-mails.com/';
export const GOOGLE_WEB_CLIENT_ID =
  getEnv('GOOGLE_WEB_CLIENT_ID') || DEFAULT_GOOGLE_WEB_CLIENT_ID;
export const GOOGLE_IOS_CLIENT_ID =
  getEnv('GOOGLE_IOS_CLIENT_ID') || '';
export const AWS_REGION =
  getEnv('REACT_APP_AWS_REGION') || getEnv('AWS_REGION') || 'us-east-1';
export const AWS_API_KEY =
  getEnv('REACT_APP_AWS_API_KEY') || getEnv('AWS_API_KEY') || '';
export const AWS_MAP_STYLE =
  getEnv('REACT_APP_AWS_MAP_STYLE') || getEnv('AWS_MAP_STYLE') || 'Standard';
