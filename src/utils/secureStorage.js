import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import CookieManager from '@react-native-cookies/cookies';
import {clearSessionQueries} from '../api/queryClient';

const SERVICE_NAME = 'com.moneymails.app.session';
const USERNAME = 'moneymails-session';

const parseJson = value => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
};

const readSessionPayload = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({service: SERVICE_NAME});
    if (!credentials) {
      return {};
    }

    return parseJson(credentials.password) || {};
  } catch (_error) {
    return {};
  }
};

const writeSessionPayload = async payload => {
  await Keychain.setGenericPassword(USERNAME, JSON.stringify(payload), {
    service: SERVICE_NAME,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const stripSensitiveFromUser = (user = {}) => {
  const safeUser = {...user};
  delete safeUser.token;
  delete safeUser.ssn;
  delete safeUser.id_number;
  delete safeUser.id_proof;
  delete safeUser.zelle_id;

  if (safeUser.address) {
    safeUser.address = {...safeUser.address};
    delete safeUser.address.zelle_id;
  }

  return safeUser;
};

export const getAuthToken = async () => {
  const payload = await readSessionPayload();
  return payload.authToken || '';
};

export const getSensitiveFields = async () => {
  const payload = await readSessionPayload();
  return {
    ssn: payload.ssn || '',
    id_number: payload.id_number || '',
    id_proof: payload.id_proof || '',
    zelle_id: payload.zelle_id || '',
  };
};

export const setSessionSecrets = async ({
  authToken = '',
  ssn = '',
  id_number = '',
  id_proof = '',
  zelle_id = '',
} = {}) => {
  await writeSessionPayload({
    authToken: authToken || '',
    ssn: ssn || '',
    id_number: id_number || '',
    id_proof: id_proof || '',
    zelle_id: zelle_id || '',
  });
};

export const mergeSensitiveIntoUser = async (user = {}) => {
  const payload = await readSessionPayload();
  const sensitive = {
    ssn: payload.ssn || '',
    id_number: payload.id_number || '',
    id_proof: payload.id_proof || '',
    zelle_id: payload.zelle_id || '',
  };

  return {
    ...user,
    token: payload.authToken || user.token || '',
    ...sensitive,
    address: {
      ...(user.address || {}),
      zelle_id: sensitive.zelle_id || user.address?.zelle_id || '',
    },
  };
};

export const clearAuthSession = async () => {
  await clearSessionQueries();
  // Start every cleanup even if one native store reports an error.
  await Promise.all([
    CookieManager.clearAll(),
    Keychain.resetGenericPassword({service: SERVICE_NAME}),
    AsyncStorage.multiRemove(['token', 'auth', 'user', 'bingo']),
  ]);
};

export const migrateFromAsyncStorage = async () => {
  const existingPayload = await readSessionPayload();
  if (existingPayload.authToken) {
    return mergeSensitiveIntoUser(
      parseJson(await AsyncStorage.getItem('user')) || {},
    );
  }

  let legacyToken = '';
  try {
    const storedToken = await AsyncStorage.getItem('token');
    legacyToken = storedToken ? JSON.parse(storedToken) : '';
  } catch (_error) {
    legacyToken = '';
  }

  const legacyUser = parseJson(await AsyncStorage.getItem('user')) || {};
  if (!legacyToken && !legacyUser?.token) {
    return null;
  }

  const authToken = legacyToken || legacyUser.token || '';
  const zelleId = legacyUser.zelle_id || legacyUser.address?.zelle_id || '';

  await setSessionSecrets({
    authToken,
    ssn: legacyUser.ssn || '',
    id_number: legacyUser.id_number || '',
    id_proof: legacyUser.id_proof || '',
    zelle_id: zelleId,
  });

  const sanitizedUser = stripSensitiveFromUser(legacyUser);
  await AsyncStorage.setItem('user', JSON.stringify(sanitizedUser));
  await AsyncStorage.removeItem('token');

  return mergeSensitiveIntoUser(sanitizedUser);
};
