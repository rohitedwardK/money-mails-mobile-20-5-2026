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
