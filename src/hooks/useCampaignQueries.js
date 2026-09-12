import {useContext} from 'react';
import {UserContext} from '../context/UserContext';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  downloadCampaignTicket,
  fetchActiveCampaigns,
  fetchCampaignDetail,
  fetchCampaigns,
  fetchUserCampaignTickets,
  initCampaignPayment,
  reserveCampaignTicket,
  sendCampaignTicketEmail,
} from '../api/moneyMails';

export const campaignKeys = {
  active: ['campaigns', 'active'],
  list: ['campaigns', 'list'],
  detail: campaignUuid => ['campaigns', 'detail', campaignUuid],
  tickets: ['campaigns', 'tickets'],
};

// Status and ticket responses depend on the signed-in account, even for one campaign.
const useCampaignQuery = ({authenticated = false, ...options}) => {
  const {userDetails} = useContext(UserContext);
  const userUuid = userDetails?.token
    ? userDetails.uuid || userDetails.user_uuid || null
    : null;
  return useQuery({
    ...options,
    queryKey: [...options.queryKey, {userUuid}],
    enabled: options.enabled !== false && (!authenticated || !!userUuid),
  });
};

export const getCollection = payload => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.campaigns)) {
    return payload.campaigns;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  if (Array.isArray(payload?.history)) {
    return payload.history;
  }
  return [];
};

export const getTotalCount = (payload, fallbackLength = 0) =>
  Number(payload?.count ?? payload?.total ?? payload?.total_count ?? fallbackLength);

export const useActiveCampaigns = ({enabled = true, limit = 4} = {}) =>
  useCampaignQuery({
    queryKey: [...campaignKeys.active, {limit}],
    queryFn: ({signal}) => fetchActiveCampaigns({limit}, {signal}),
    enabled,
    staleTime: 30000,
  });

export const useCampaigns = ({enabled = true} = {}) =>
  useCampaignQuery({
    queryKey: campaignKeys.list,
    queryFn: ({signal}) => fetchCampaigns({signal}),
    enabled,
    staleTime: 30000,
  });

export const useCampaignDetail = ({campaignUuid, enabled = true}) =>
  useCampaignQuery({
    queryKey: campaignKeys.detail(campaignUuid),
    queryFn: ({signal}) => fetchCampaignDetail(campaignUuid, {signal}),
    enabled: enabled && !!campaignUuid,
    staleTime: 15000,
    refetchInterval: 30000,
  });

export const useCampaignTicketHistory = ({enabled = true} = {}) =>
  useCampaignQuery({
    queryKey: campaignKeys.tickets,
    queryFn: ({signal}) => fetchUserCampaignTickets({page: 0, limit: 20}, {signal}),
    authenticated: true,
    enabled,
    staleTime: 30000,
  });

export const useReserveCampaignTicket = campaignUuid => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reserveCampaignTicket(campaignUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: campaignKeys.active});
      queryClient.invalidateQueries({queryKey: campaignKeys.list});
      queryClient.invalidateQueries({queryKey: campaignKeys.detail(campaignUuid)});
      queryClient.invalidateQueries({queryKey: campaignKeys.tickets});
    },
  });
};

export const useInitCampaignPayment = campaignUuid => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => initCampaignPayment(campaignUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: campaignKeys.detail(campaignUuid)});
      queryClient.invalidateQueries({queryKey: campaignKeys.tickets});
    },
  });
};

export const useSendCampaignTicketEmail = () =>
  useMutation({
    mutationFn: ticketUuid => sendCampaignTicketEmail(ticketUuid),
  });

export const useDownloadCampaignTicket = () =>
  useMutation({
    mutationFn: ticketUuid => downloadCampaignTicket(ticketUuid),
  });
