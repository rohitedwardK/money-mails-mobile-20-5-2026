import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserProfile} from '../api/moneyMails';

const getPhoneValue = mobile => String(mobile || '').replace('+', '');

const getPhoneParts = mobile => {
  const phoneValue = getPhoneValue(mobile);

  if (!phoneValue) {
    return {code: '1', value: ''};
  }

  if (phoneValue.length <= 10) {
    return {code: '1', value: phoneValue};
  }

  return phoneValue.length === 11
    ? {code: phoneValue.slice(0, 1), value: phoneValue.slice(1)}
    : {code: phoneValue.slice(0, 2), value: phoneValue.slice(2)};
};

const getLocationValue = value => {
  if (value && typeof value === 'object') {
    return value.uuid || value.value || value._id || value.id || '';
  }

  return value || '';
};

const findLocationValue = (items, selectedValue) => {
  if (!Array.isArray(items) || !items.length) {
    return '';
  }

  const selectedText = String(selectedValue || '').trim().toLowerCase();
  const matchedItem = items.find(item => {
    const itemIds = [item?.uuid, item?.value, item?._id, item?.id]
      .filter(Boolean)
      .map(value => String(value).trim().toLowerCase());
    const itemLabels = [item?.name, item?.label, item?.title]
      .filter(Boolean)
      .map(value => String(value).trim().toLowerCase());

    return itemIds.includes(selectedText) || itemLabels.includes(selectedText);
  });

  return matchedItem ? getLocationValue(matchedItem) : '';
};

const getProfileLocationValue = (safeData, field, rawValue) => {
  const directValue = getLocationValue(rawValue);

  if (/^[A-Z]{2,5}-[A-Z0-9]+$/i.test(String(directValue || '').trim())) {
    return directValue;
  }

  const lookupKeys = {
    country: 'countries',
    state: 'states',
    county: 'counties',
    city: 'cities',
  };

  return findLocationValue(safeData?.[lookupKeys[field]], directValue) || directValue;
};

export const extractAuthData = (payload = {}) => ({
  ...(payload?.data || {}),
  ...(payload?.bingoDetail || {}),
  token:
    payload?.token ||
    payload?.data?.token ||
    payload?.bingoDetail?.token ||
    '',
});

export const buildUserSession = (data = {}) => {
  const safeData = data || {};
  const phone = getPhoneParts(safeData?.mobile || safeData?.phone?.value);
  const country = getProfileLocationValue(
    safeData,
    'country',
    safeData?.country_uuid ||
      safeData?.address?.country_uuid ||
      safeData?.address?.country ||
      safeData?.country,
  );
  const state = getProfileLocationValue(
    safeData,
    'state',
    safeData?.state_uuid ||
      safeData?.address?.state_uuid ||
      safeData?.address?.state ||
      safeData?.state,
  );
  const county = getProfileLocationValue(
    safeData,
    'county',
    safeData?.county_uuid ||
      safeData?.address?.county_uuid ||
      safeData?.address?.county ||
      safeData?.county,
  );
  const city = getProfileLocationValue(
    safeData,
    'city',
    safeData?.city_uuid ||
      safeData?.address?.city_uuid ||
      safeData?.address?.city ||
      safeData?.city,
  );

  return {
    ...safeData,
    firstName:
      safeData?.firstName || safeData?.given_name || safeData?.givenName || '',
    lastName:
      safeData?.lastName || safeData?.family_name || safeData?.familyName || '',
    avatar: safeData?.avatar || safeData?.profile_pic || '',
    mobile: safeData?.mobile || '',
    ssn: safeData?.ssn || '',
    id_proof: safeData?.id_proof || '',
    id_number: safeData?.id_number || '',
    gender: safeData?.gender || '',
    age: safeData?.age || '',
    intrests: safeData?.interests || safeData?.intrests || [],
    languages: safeData?.languages || [],
    religion: safeData?.religion || '',
    phone,
    primaryEmail:
      safeData?.email || safeData?.primaryEmail || safeData?.primary_email || '',
    address: {
      ...(safeData?.address || {}),
      location: safeData?.address1 || safeData?.address?.location || '',
      city,
      cityName:
        safeData?.city_name ||
        safeData?.cityName ||
        safeData?.city ||
        safeData?.address?.cityName ||
        safeData?.address?.city_name ||
        '',
      addressLine1: safeData?.address2 || safeData?.address?.addressLine1 || '',
      state,
      stateName:
        safeData?.state_name ||
        safeData?.stateName ||
        safeData?.state ||
        safeData?.address?.stateName ||
        safeData?.address?.state_name ||
        '',
      county,
      countyName:
        safeData?.county_name ||
        safeData?.countyName ||
        safeData?.county ||
        safeData?.address?.countyName ||
        safeData?.address?.county_name ||
        '',
      country,
      countryName:
        safeData?.country_name ||
        safeData?.countryName ||
        safeData?.country ||
        safeData?.address?.countryName ||
        safeData?.address?.country_name ||
        '',
      apartmentNo:
        safeData?.apartment_number || safeData?.address?.apartmentNo || '',
      zip: safeData?.pincode || safeData?.address?.zip || '',
      landmark: safeData?.landmark || safeData?.address?.landmark || '',
      zelle_id: safeData?.zelle_id || safeData?.address?.zelle_id || '',
    },
    demographics: {
      ...(safeData?.demographics || {}),
      race: safeData?.ethnicity || safeData?.demographics?.race || '',
      dob: safeData?.dob || safeData?.demographics?.dob || '',
    },
    location: safeData?.location || null,
    user_uuid: safeData?.uuid || safeData?.user_uuid || '',
    uuid: safeData?.uuid || safeData?.user_uuid || '',
    isAuthenticated: true,
    token: safeData?.token || '',
    rewards: safeData?.rewards,
    bingo: safeData?.bingo,
    bingoDetail: safeData?.bingoDetail,
    user_verified: safeData?.user_verified,
    user_verified_by_admin: safeData?.user_verified_by_admin,
    is_admin_sent_mail: safeData?.is_admin_sent_mail,
    profileCompleted: safeData?.profileCompleted,
    requiresProfileCompletion: safeData?.requiresProfileCompletion,
    redirectTo: safeData?.redirectTo || '',
  };
};

export const persistUserSession = async (data, setUserDetails) => {
  const userData = buildUserSession(data);

  if (typeof setUserDetails === 'function') {
    setUserDetails(userData);
  }

  await AsyncStorage.setItem('auth', JSON.stringify(true));
  await AsyncStorage.setItem('user', JSON.stringify(userData));
  await AsyncStorage.setItem('token', JSON.stringify(userData.token || ''));
  if (userData.bingo !== undefined) {
    await AsyncStorage.setItem('bingo', JSON.stringify(userData.bingo));
  }

  return userData;
};

export const isProfileCompletionPending = (data = {}) => {
  if (data?.requiresProfileCompletion === true) {
    return true;
  }

  if (data?.profileCompleted === true) {
    return false;
  }

  const redirectTarget = String(data?.redirectTo || '').trim().toLowerCase();
  if (redirectTarget === 'home') {
    return false;
  }

  if (redirectTarget === 'complete-profile' || redirectTarget === 'complete_profile') {
    return true;
  }

  const firstName = String(
    data?.firstName || data?.given_name || data?.givenName || '',
  ).trim();
  const lastName = String(
    data?.lastName || data?.family_name || data?.familyName || '',
  ).trim();
  const email = String(
    data?.email || data?.primaryEmail || data?.primary_email || '',
  ).trim();
  const country = String(data?.country || data?.address?.country || '').trim();
  const state = String(data?.state || data?.address?.state || '').trim();
  const county = String(data?.county || data?.address?.county || '').trim();
  const city = String(data?.city || data?.address?.city || '').trim();
  const pincode = String(data?.pincode || data?.address?.zip || '').trim();
  const addressLine = String(
    data?.address1 || data?.address?.location || '',
  ).trim();

  return !(
    firstName &&
    lastName &&
    email &&
    country &&
    state &&
    county &&
    city &&
    /^\d{5}$/.test(pincode) &&
    addressLine
  );
};

export const getPostAuthRoute = (data = {}) => {
  const redirectTarget = String(data?.redirectTo || '').trim().toLowerCase();

  if (redirectTarget === 'home') {
    return {stack: 'UserScreens'};
  }

  if (redirectTarget === 'complete-profile' || redirectTarget === 'complete_profile') {
    return {stack: 'UserScreens', screen: 'CompleteInfo'};
  }

  if (isProfileCompletionPending(data)) {
    return {stack: 'UserScreens', screen: 'CompleteInfo'};
  }

  if (data?.user_verified_by_admin === false || data?.is_admin_sent_mail === false) {
    return {stack: 'LoginScreens', screen: 'PendingVerification'};
  }

  return data?.user_verified
    ? {stack: 'UserScreens'}
    : {stack: 'LoginScreens', screen: 'Verification'};
};

export const fetchAuthenticatedUserProfile = async authData => {
  const userUuid = String(authData?.uuid || authData?.user_uuid || '').trim();
  if (!authData?.token || !userUuid) {
    return authData;
  }

  const payload = await fetchUserProfile(userUuid, authData.token);
  return {
    ...authData,
    ...(payload?.data || {}),
    token: payload?.token || authData.token,
  };
};
