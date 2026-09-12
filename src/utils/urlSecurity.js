import {API_URL, BINGO_URL} from '../config';

const getHostname = value => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch (_error) {
    return '';
  }
};

const getAllowedApiHosts = () => {
  const hosts = new Set();
  const apiHost = getHostname(API_URL);
  const bingoHost = getHostname(BINGO_URL);

  if (apiHost) {
    hosts.add(apiHost);
  }
  if (bingoHost) {
    hosts.add(bingoHost);
  }

  return hosts;
};

export const isAllowedApiHost = hostname => {
  const normalizedHost = String(hostname || '').toLowerCase();
  if (!normalizedHost) {
    return false;
  }

  return getAllowedApiHosts().has(normalizedHost);
};

export const assertAllowedRequestUrl = url => {
  const hostname = getHostname(url);
  if (!isAllowedApiHost(hostname)) {
    throw new Error(`Blocked request to untrusted host: ${hostname || url}`);
  }
};

const PAYMENT_HOSTS = new Set([
  'money-mails.com',
  'www.money-mails.com',
  'api.money-mails.com',
  'stage-api.money-mails.com',
  'stripe.com',
  'checkout.stripe.com',
  'pay.stripe.com',
]);

export const isAllowedPaymentUrl = value => {
  try {
    const parsed = new URL(String(value || '').trim());
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    return (
      PAYMENT_HOSTS.has(hostname) ||
      hostname.endsWith('.stripe.com') ||
      hostname.endsWith('.money-mails.com')
    );
  } catch (_error) {
    return false;
  }
};

const MAIL_HTML_HOSTS = new Set([
  'money-mails.com',
  'www.money-mails.com',
  'api.money-mails.com',
  'stage-api.money-mails.com',
  'stage.money-mails.com',
]);

export const isAllowedMailHtmlUrl = value => {
  try {
    const parsed = new URL(String(value || '').trim());
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    return (
      MAIL_HTML_HOSTS.has(hostname) ||
      hostname.endsWith('.money-mails.com') ||
      hostname.endsWith('.amazonaws.com') ||
      hostname.endsWith('.cloudfront.net')
    );
  } catch (_error) {
    return false;
  }
};

export const getBingoOriginWhitelist = () => {
  const bingoHost = getHostname(BINGO_URL);
  if (!bingoHost) {
    return ['https://bingo.money-mails.com'];
  }

  return [`https://${bingoHost}`];
};

export const isAllowedBingoNavigation = (url, bingoUrl = BINGO_URL) => {
  try {
    const target = new URL(url);
    const allowedHost = getHostname(bingoUrl);
    return (
      (target.protocol === 'https:' || target.protocol === 'about:') &&
      (target.protocol === 'about:' || target.hostname.toLowerCase() === allowedHost)
    );
  } catch (_error) {
    return false;
  }
};
