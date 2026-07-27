import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';

export class ApiError extends Error {
  constructor(message, {status, payload, url} = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.url = url;
  }
}

export const buildQuery = params => {
  if (typeof params === 'string') {
    return params.replace(/^\?/, '');
  }

  return Object.entries(params || {})
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const normalizedValue = Array.isArray(value) ? value.join(',') : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        normalizedValue,
      )}`;
    })
    .join('&');
};

export const getStoredToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    const parsedToken = storedToken ? JSON.parse(storedToken) : '';
    if (parsedToken) {
      return parsedToken;
    }
  } catch (_error) {
    // Fall back to user session below.
  }

  try {
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser?.token || '';
  } catch (_error) {
    return '';
  }
};

const parseResponse = async response => {
  const responseText = await response.text();

  try {
    return responseText ? JSON.parse(responseText) : {};
  } catch (_error) {
    return responseText;
  }
};

const isHtmlResponse = value =>
  typeof value === 'string' &&
  /<!doctype html|<html[\s>]|<\/html>/i.test(value.trim());

const getFallbackErrorMessage = (payload, response) => {
  if (payload?.message || payload?.error) {
    return payload.message || payload.error;
  }

  if (isHtmlResponse(payload)) {
    return response.status === 404
      ? 'This API endpoint is not available in the current environment.'
      : 'The server returned an invalid response. Please try again later.';
  }

  if (typeof payload === 'string') {
    const text = payload.trim();
    if (text && text.length <= 160) {
      return text;
    }
  }

  return `Request failed with HTTP ${response.status}`;
};

export const apiRequest = async (
  path,
  {method = 'GET', body, headers = {}, auth = true, token, isFormData} = {},
) => {
  const requestHeaders = {...headers};

  if (!isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const authToken = token || (auth ? await getStoredToken() : '');
  if (authToken) {
    requestHeaders['x-auth-token'] = authToken;
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    const message = getFallbackErrorMessage(payload, response);
    throw new ApiError(message, {status: response.status, payload, url});
  }

  return payload;
};

export const apiGet = (path, params, options) => {
  const query = buildQuery(params);
  return apiRequest(query ? `${path}?${query}` : path, options);
};

export const apiPost = (path, body, options) =>
  apiRequest(path, {...options, method: 'POST', body});

export const apiPut = (path, body, options) =>
  apiRequest(path, {...options, method: 'PUT', body});

export const apiDelete = (path, options) =>
  apiRequest(path, {...options, method: 'DELETE'});
