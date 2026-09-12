import {Linking} from 'react-native';
import {isAllowedPaymentUrl, isAllowedMailHtmlUrl} from '../../../utils/urlSecurity';

export const CAMPAIGN_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  REDEEMED: 'REDEEMED',
  EXPIRED: 'EXPIRED',
};

const isEnabledFlag = value => value === 1 || value === true || String(value) === '1';

export const normalizeStatus = value => {
  const status = String(value || CAMPAIGN_STATUS.AVAILABLE).toUpperCase();
  if (status === 'ALLOCATED' || status === 'BOOKED') {
    return CAMPAIGN_STATUS.REDEEMED;
  }
  if (status === 'ACTIVE') {
    return CAMPAIGN_STATUS.AVAILABLE;
  }
  if (Object.values(CAMPAIGN_STATUS).includes(status)) {
    return status;
  }
  return CAMPAIGN_STATUS.AVAILABLE;
};

export const getCampaignUuid = campaign =>
  campaign?.uuid || campaign?.campaign_uuid || campaign?.id || '';

export const getCampaignTitle = campaign =>
  campaign?.title || campaign?.name || campaign?.campaign_name || 'Campaign';

export const getCampaignDescription = campaign =>
  campaign?.description ||
  campaign?.short_description ||
  campaign?.summary ||
  'Reserve your ticket and complete payment before the timer expires.';

export const getCampaignImage = campaign =>
  campaign?.image_url ||
  campaign?.image ||
  campaign?.banner_url ||
  campaign?.banner ||
  campaign?.thumbnail_url ||
  campaign?.thumbnail ||
  '';

export const getCampaignStatus = (campaign = {}) => {
  const bookedFlag = campaign.booked ?? campaign.Booked ?? campaign.is_booked ?? campaign.isBooked;
  const reservedFlag =
    campaign.reserved ?? campaign.Reserved ?? campaign.is_reserved ?? campaign.isReserved;
  const userTicketStatus =
    campaign.user_ticket?.status ||
    campaign.userTicket?.status ||
    campaign.booked_ticket?.status ||
    campaign.ticket?.status;

  if (isEnabledFlag(bookedFlag)) {
    return CAMPAIGN_STATUS.REDEEMED;
  }
  if (isEnabledFlag(reservedFlag)) {
    return CAMPAIGN_STATUS.RESERVED;
  }

  return normalizeStatus(
    userTicketStatus ||
      campaign.user_status ||
      campaign.ticket_status ||
      campaign.status ||
      campaign.reservation_status,
  );
};

export const getStatusLabel = status => {
  if (status === CAMPAIGN_STATUS.REDEEMED) {
    return 'Booked';
  }
  if (status === CAMPAIGN_STATUS.RESERVED) {
    return 'Reserved';
  }
  if (status === CAMPAIGN_STATUS.EXPIRED) {
    return 'Expired';
  }
  return 'Available';
};

const resolveAvailability = (campaign = {}) => {
  const available =
    campaign.available ??
    campaign.availableTickets ??
    campaign.available_tickets_count ??
    campaign.available_tickets ??
    campaign.available_count ??
    campaign.availableTicketCount ??
    campaign.tickets_available ??
    campaign.ticket_available ??
    campaign.remaining_tickets ??
    campaign.remaining_count;
  const total =
    campaign.total ??
    campaign.totalTickets ??
    campaign.total_tickets ??
    campaign.total_ticket_count ??
    campaign.ticket_count ??
    campaign.total_count;

  return {available, total};
};

export const getAvailabilityText = (campaign = {}) => {
  const {available, total} = resolveAvailability(campaign);

  if (available == null && total == null) {
    return '0 available';
  }
  if (available != null && total != null) {
    return `${available}/${total} available`;
  }
  if (available != null) {
    return `${available} available`;
  }
  return `${total} total tickets`;
};

export const getAvailabilityCount = (campaign = {}) => {
  const {available, total} = resolveAvailability(campaign);

  if (available == null && total == null) {
    return '0/0';
  }
  if (available != null && total != null) {
    return `${available}/${total}`;
  }
  if (available != null) {
    return `${available}`;
  }
  return `${total}`;
};

export const formatCurrency = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '';
  }
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
};

export const formatDateTime = value => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatEventDate = value => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatEventDateRange = (campaign = {}) => {
  const start =
    campaign?.event_date ||
    campaign?.event_at ||
    campaign?.starts_at ||
    campaign?.start_date;
  const end = campaign?.ends_at || campaign?.end_date || campaign?.valid_until;

  const startLabel = formatEventDate(start);
  const endLabel = formatEventDate(end);

  if (startLabel && endLabel && startLabel !== endLabel) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${startDate.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} – ${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    return `${startLabel} – ${endLabel}`;
  }

  return startLabel || endLabel || 'Date TBD';
};

export const getCampaignLocation = (campaign = {}) => {
  const city =
    campaign?.city ||
    campaign?.city_name ||
    campaign?.location_city ||
    campaign?.venue_city;
  const state =
    campaign?.state ||
    campaign?.state_name ||
    campaign?.location_state ||
    campaign?.venue_state;
  const venue = campaign?.venue || campaign?.venue_name || campaign?.location;
  const location = campaign?.location_name || campaign?.address;

  if (city && state) {
    return `${city}, ${state}`;
  }
  if (location) {
    return String(location);
  }
  if (venue) {
    return String(venue);
  }
  if (city) {
    return String(city);
  }
  return 'Location TBD';
};

export const getAvailabilityLeftText = (campaign = {}) => {
  const count = String(getAvailabilityCount(campaign));
  if (count.includes('/')) {
    return `${count.replace('/', ' of ')} tickets left`;
  }
  return `${count} tickets left`;
};

export const getTicketTypeLabel = (campaign = {}) =>
  campaign?.ticket_type ||
  campaign?.ticket_name ||
  campaign?.admission_type ||
  'General Admission';

export const getCampaignFeatures = (campaign = {}) => {
  if (Array.isArray(campaign?.features) && campaign.features.length > 0) {
    return campaign.features.map(item =>
      typeof item === 'string'
        ? {icon: 'ellipse-outline', label: item}
        : {
            icon: item?.icon || 'ellipse-outline',
            label: item?.label || item?.name || item?.title || 'Feature',
          },
    );
  }

  const defaults = [];
  const days = campaign?.event_days || campaign?.duration_days;
  if (days) {
    defaults.push({icon: 'calendar-outline', label: `${days}-Day Access`});
  } else {
    defaults.push({icon: 'calendar-outline', label: 'Multi-day access'});
  }

  defaults.push(
    {icon: 'musical-notes-outline', label: 'Multiple stages'},
    {icon: 'people-outline', label: '18+ event'},
    {icon: 'lock-closed-outline', label: 'Non-refundable'},
  );

  return defaults;
};

export const filterCampaignsByStatus = (campaigns = [], filter = 'ALL') => {
  if (!Array.isArray(campaigns) || filter === 'ALL') {
    return campaigns;
  }

  return campaigns.filter(campaign => getCampaignStatus(campaign) === filter);
};

export const getPaymentUrl = (payload = {}) =>
  payload.payment_url ||
  payload.checkout_url ||
  payload.redirect_url ||
  payload.url ||
  payload?.data?.payment_url ||
  payload?.data?.checkout_url ||
  payload?.data?.redirect_url ||
  payload?.data?.url;

export const getTicketUuid = ticket =>
  ticket?.ticket_uuid ||
  ticket?.uuid ||
  ticket?.ticket?.ticket_uuid ||
  ticket?.booking?.ticket_uuid ||
  ticket?.user_ticket?.ticket_uuid ||
  ticket?.userTicket?.ticket_uuid ||
  ticket?.booked_ticket?.ticket_uuid ||
  '';

export const getTicketCampaign = ticket => ticket?.campaign || ticket?.campaign_detail || ticket;

export const getDownloadUrl = payload =>
  payload?.pdf_url ||
  payload?.ticket_pdf_url ||
  payload?.download_url ||
  payload?.url ||
  payload?.data?.pdf_url ||
  payload?.data?.ticket_pdf_url ||
  payload?.data?.download_url ||
  payload?.data?.url;

export const openPaymentUrl = async url => {
  if (!isAllowedPaymentUrl(url) && !isAllowedMailHtmlUrl(url)) {
    throw new Error('URL is not allowed.');
  }

  await Linking.openURL(url);
};
