import {AWS_API_KEY, AWS_REGION} from '../config';

const asText = value => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return value?.Name || value?.Value || value?.Code || '';
};

const extractCity = address => {
  const municipality =
    asText(address?.Municipality) ||
    asText(address?.Locality) ||
    asText(address?.City);
  if (municipality) return municipality;

  const subRegion = asText(address?.SubRegion);
  return /county/i.test(subRegion) ? '' : subRegion;
};

const normalizeAddress = (rawAddress = {}, position = []) => {
  const city = extractCity(rawAddress);
  const stateCode = rawAddress?.Region?.Code || '';
  const stateName = rawAddress?.Region?.Name || '';
  const postalRaw = asText(rawAddress?.PostalCode);
  const zip = postalRaw.match(/\d{5}/)?.[0] || postalRaw;
  const label =
    rawAddress?.Label ||
    [rawAddress?.AddressNumber, rawAddress?.Street].filter(Boolean).join(' ');

  return {
    address1: label,
    address2: '',
    street: [rawAddress?.AddressNumber, rawAddress?.Street]
      .filter(Boolean)
      .join(' '),
    city,
    state: stateCode,
    stateName,
    zip,
    county: asText(rawAddress?.SubRegion),
    country: rawAddress?.Country?.Name || '',
    lat: position?.[1],
    lng: position?.[0],
    displayLine1: label,
    displayLine2: [city, stateCode, zip].filter(Boolean).join(', '),
  };
};

const requestAwsPlaces = async (path, options = {}) => {
  if (!AWS_API_KEY) {
    throw new Error('AWS Places is not configured.');
  }

  const response = await fetch(
    `https://places.geo.${AWS_REGION}.amazonaws.com/v2/${path}${
      path.includes('?') ? '&' : '?'
    }key=${AWS_API_KEY}`,
    {
      headers: {'Content-Type': 'application/json'},
      ...options,
    },
  );
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || 'Address lookup failed.');
  }

  return payload;
};

export const fetchPlaceAutocomplete = async (query, countryAlpha3 = 'USA') => {
  const body = {QueryText: query, MaxResults: 6};
  if (countryAlpha3) body.Filter = {IncludeCountries: [countryAlpha3]};

  const payload = await requestAwsPlaces('autocomplete', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return payload?.ResultItems || [];
};

export const fetchPlaceDetails = async placeId => {
  const payload = await requestAwsPlaces(
    `place/${encodeURIComponent(placeId)}`,
  );

  return normalizeAddress(payload?.Address || {}, payload?.Position || []);
};

export const reverseGeocode = async (lng, lat) => {
  const payload = await requestAwsPlaces('reverse-geocode', {
    method: 'POST',
    body: JSON.stringify({QueryPosition: [lng, lat], MaxResults: 1}),
  });
  const item = payload?.ResultItems?.[0];

  if (!item) return null;

  return normalizeAddress(item?.Address || {}, item?.Position || [lng, lat]);
};
