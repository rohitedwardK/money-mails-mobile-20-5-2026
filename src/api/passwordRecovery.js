import {apiPost} from './client';
const root = '/user/password-recovery';
export const requestRecoveryCode = email => apiPost(root + '/request', {email}, {auth: false});
export const verifyRecoveryCode = (email, otp) => apiPost(root + '/verify', {email, otp}, {auth: false});
export const completePasswordRecovery = (resetToken, password) =>
  apiPost(root + '/complete', {resetToken, password}, {auth: false});
