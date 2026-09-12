import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';
import getColors from '../../../utils/colors';
import {
  getCollection,
  useCampaignTicketHistory,
  useDownloadCampaignTicket,
  useSendCampaignTicketEmail,
} from '../../../hooks/useCampaignQueries';
import {CampaignStatusBadge} from './CampaignCard';
import {styles as campaignStyles} from './index.style';
import {
  formatDateTime,
  getCampaignStatus,
  getCampaignTitle,
  getDownloadUrl,
  getTicketCampaign,
  getTicketUuid,
  openPaymentUrl,
} from './utils';

const TicketHistory = () => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const {data, isLoading, error} = useCampaignTicketHistory();
  const emailMutation = useSendCampaignTicketEmail();
  const downloadMutation = useDownloadCampaignTicket();
  const tickets = getCollection(data);

  const getTicketReference = ticketUuid =>
    ticketUuid ? `#${String(ticketUuid).slice(-8).toUpperCase()}` : 'Pending';

  const handleEmail = async ticketUuid => {
    try {
      await emailMutation.mutateAsync(ticketUuid);
      Toast.show('Ticket email sent.', Toast.SHORT);
    } catch (err) {
      Toast.show(err?.message || 'Unable to send ticket email.', Toast.LONG);
    }
  };

  const handleDownload = async ticketUuid => {
    try {
      const payload = await downloadMutation.mutateAsync(ticketUuid);
      const url = getDownloadUrl(payload);
      if (url) {
        await openPaymentUrl(url);
      } else {
        Toast.show('Ticket download is ready.', Toast.SHORT);
      }
    } catch (err) {
      Toast.show(err?.message || 'Unable to download ticket.', Toast.LONG);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.stateBox]}>
        <ActivityIndicator color={themeColors.highlightPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={tickets}
        contentContainerStyle={styles.content}
        keyExtractor={(item, index) => getTicketUuid(item) || `${index}`}
        renderItem={({item}) => {
          const campaign = getTicketCampaign(item);
          const ticketUuid = getTicketUuid(item);
          const bookedAt =
            formatDateTime(item?.booked_at || item?.reserved_at || item?.created_at) ||
            'Ticket reserved';
          return (
            <View style={styles.ticketCard}>
              <View style={styles.ticketCardHeader}>
                <View style={styles.ticketIconWrap}>
                  <EntypoIcon name="ticket" size={24} color={themeColors.highlightPrimary} />
                </View>
                <View style={styles.ticketHeaderContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {getCampaignTitle(campaign)}
                    </Text>
                    <CampaignStatusBadge status={getCampaignStatus(item)} />
                  </View>
                  <Text style={styles.ticketSubtitle}>Booked ticket</Text>
                </View>
              </View>

              <View style={styles.ticketInfoPanel}>
                <View style={styles.ticketInfoItem}>
                  <Text style={styles.ticketInfoLabel}>Booking time</Text>
                  <Text style={styles.ticketInfoValue}>{bookedAt}</Text>
                </View>
                <View style={styles.ticketInfoDivider} />
                <View style={styles.ticketInfoItem}>
                  <Text style={styles.ticketInfoLabel}>Ticket ID</Text>
                  <Text style={styles.ticketInfoValue}>{getTicketReference(ticketUuid)}</Text>
                </View>
              </View>

              <View style={styles.ticketActions}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!ticketUuid || emailMutation.isPending}
                  style={[styles.ticketAction, !ticketUuid ? styles.disabledButton : null]}
                  onPress={() => handleEmail(ticketUuid)}>
                  <EntypoIcon name="mail" size={15} color={themeColors.white} />
                  <Text style={styles.ticketActionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!ticketUuid || downloadMutation.isPending}
                  style={[
                    styles.ticketAction,
                    styles.ticketActionOutline,
                    !ticketUuid ? styles.disabledButton : null,
                  ]}
                  onPress={() => handleDownload(ticketUuid)}>
                  <EntypoIcon
                    name="download"
                    size={15}
                    color={themeColors.highlightPrimary}
                  />
                  <Text style={[styles.ticketActionText, styles.ticketActionOutlineText]}>
                    Download
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>
              {error ? 'Ticket history unavailable' : 'No campaign tickets'}
            </Text>
            <Text style={styles.stateText}>
              {error?.message || 'Booked and reserved campaign tickets will show here.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TicketHistory;
