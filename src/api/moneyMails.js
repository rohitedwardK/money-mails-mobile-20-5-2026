import {apiDelete, apiGet, apiPost, apiPut} from './client';

export const fetchCategories = params => apiGet('/category/list', params);

export const fetchBrands = params => apiGet('/user/brand/list', params);

export const fetchSubCategories = params =>
  apiGet('/sub_category/lists', params);

export const fetchStatesByCountry = countryUuid =>
  apiGet(`/state/list/by/country/${countryUuid}`, null, {auth: false});

export const fetchCountiesByState = stateUuid =>
  apiGet(`/county/list/by/state/${stateUuid}`, null, {auth: false});

export const fetchCitiesByCounty = countyUuid =>
  apiGet(`/city/list/by/county/${countyUuid}`, null, {auth: false});

export const createCounty = (stateUuid, countyName) =>
  apiPost('/county', {
    state_uuid: stateUuid,
    name: countyName,
  }, {auth: false});

export const createCity = (countyUuid, cityName) =>
  apiPost('/city', {
    county_uuid: countyUuid,
    name: cityName,
  }, {auth: false});

export const fetchMails = params => apiGet('/mail/list', params);

export const fetchMailHtml = htmlUrl =>
  apiPost('/mail/read/html/file', {html_url: htmlUrl});

export const updateMailFavourite = payload =>
  apiPut('/mail/update/favourite', payload);

export const updateMailRedeem = payload => apiPut('/mail/update/redeem', payload);

export const updateMailUnsubscribe = payload =>
  apiPut('/mail/unsubscribe', payload);

export const updateBrandFavourite = payload => apiPost('/favourite', payload);

export const fetchStoreProfile = storeUuid =>
  storeUuid ? apiGet(`/store/profile/${storeUuid}`) : Promise.resolve(null);

export const fetchQuickOffers = storeUuid =>
  storeUuid
    ? apiGet('/store/quick-offers', {
        store_uuid: storeUuid,
        active_only: true,
        exclude_expired: true,
      })
    : Promise.resolve(null);

export const sendEmailOtp = email =>
  apiPost('/user/email/send-otp', {email}, {auth: false});

export const verifyEmailOtp = (email, otp) =>
  apiPost('/user/email/verify-otp', {email, otp}, {auth: false});

export const loginWithPassword = (username, password) =>
  apiPost('/user/login', {username, password}, {auth: false});

export const registerGoogle = profile =>
  apiPost('/auth/google/register', profile, {auth: false});

export const fetchUserProfile = (userUuid, token) =>
  apiGet(`/user/consumer/get/profile/${userUuid}`, null, {token});

export const deleteAccount = userUuid => apiDelete(`/user/delete/account/${userUuid}`);

export const completeVerifiedEmailProfile = payload =>
  apiPost('/user/register/complete-profile', payload, {auth: false});

export const completeAuthenticatedProfile = (userUuid, payload) =>
  apiPut(`/user/complete/profile/${userUuid}`, payload);

export const fetchRewards = userUuid => apiGet(`/user/point/${userUuid}`);

export const redeemPointsCheck = payload =>
  apiPost('/point/redeemed/check', payload);

export const redeemPoints = payload => apiPost('/point/redeemed', payload);

export const fetchRedeemHistory = params =>
  apiGet('/point/redeemed/history/list', params);

export const fetchNotifications = params =>
  apiGet('/notification/list/consumer', params);

export const updateNotificationsSeen = payload =>
  apiPut('/notification/update/seen', payload);

export const uploadUserFile = formData =>
  apiPost('/user/upload/file', formData, {isFormData: true});

export const fetchActiveCampaigns = (params = {}) =>
  apiGet('/campaigns/active', params);

export const fetchCampaigns = () => apiGet('/campaigns');

export const fetchCampaignDetail = campaignUuid =>
  apiGet(`/campaigns/${campaignUuid}`);

export const reserveCampaignTicket = campaignUuid =>
  apiPost(`/campaigns/${campaignUuid}/reserve`);

export const initCampaignPayment = campaignUuid =>
  apiPost(`/campaigns/${campaignUuid}/payment-init`);

export const fetchUserCampaignTickets = (params = {}) =>
  apiGet('/campaigns/user/tickets', params);

export const sendCampaignTicketEmail = ticketUuid =>
  apiPost(`/campaigns/user/tickets/${ticketUuid}/send-email`);

export const downloadCampaignTicket = ticketUuid =>
  apiGet(`/campaigns/user/tickets/${ticketUuid}/download`);
