import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import getColors from '../../../utils/colors';
import {
  getCollection,
  useCampaignDetail,
  useInitCampaignPayment,
  useReserveCampaignTicket,
} from '../../../hooks/useCampaignQueries';
import CampaignCard, {CampaignStatusBadge} from './CampaignCard';
import {styles as campaignStyles} from './index.style';
import {
  CAMPAIGN_STATUS,
  formatCurrency,
  formatDateTime,
  getAvailabilityText,
  getCampaignDescription,
  getCampaignImage,
  getCampaignStatus,
  getCampaignTitle,
  getCampaignUuid,
  getPaymentUrl,
} from './utils';

const CampaignDetail = ({navigation, route}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const campaignUuid = route?.params?.campaignUuid;
  const {data, isLoading, error} = useCampaignDetail({campaignUuid});
  const reserveMutation = useReserveCampaignTicket(campaignUuid);
  const paymentMutation = useInitCampaignPayment(campaignUuid);
  const campaign = data?.data || data?.campaign || data || {};
  const status = getCampaignStatus(campaign);
  const image = getCampaignImage(campaign);
  const price = formatCurrency(campaign?.price ?? campaign?.ticket_price ?? campaign?.amount);
  const recommended = getCollection(data?.recommended || data?.related).filter(
    item => getCampaignUuid(item) !== campaignUuid,
  );

  const openPayment = async payload => {
    const url = getPaymentUrl(payload);
    if (url) {
      await Linking.openURL(url);
    }
  };

  const handleReserve = async () => {
    try {
      const payload = await reserveMutation.mutateAsync();
      Toast.show('Ticket reserved.', Toast.SHORT);
      await openPayment(payload);
    } catch (err) {
      Toast.show(err?.message || 'Unable to reserve ticket.', Toast.LONG);
    }
  };

  const handlePayment = async () => {
    try {
      const payload = await paymentMutation.mutateAsync();
      const url = getPaymentUrl(payload);
      if (url) {
        await Linking.openURL(url);
      } else {
        Toast.show('Payment initialized.', Toast.SHORT);
      }
    } catch (err) {
      Toast.show(err?.message || 'Unable to start payment.', Toast.LONG);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.stateBox]}>
        <ActivityIndicator color={themeColors.highlightPrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.stateBox]}>
        <Text style={styles.stateTitle}>Campaign unavailable</Text>
        <Text style={styles.stateText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {image ? (
          <Image source={{uri: image}} resizeMode="cover" style={styles.detailImage} />
        ) : (
          <View style={[styles.detailImage, styles.cardImageFallback]}>
            <EntypoIcon name="ticket" size={42} color={themeColors.highlightPrimary} />
          </View>
        )}
        <View style={styles.detailBody}>
          <CampaignStatusBadge status={status} />
          <Text style={styles.detailTitle}>{getCampaignTitle(campaign)}</Text>
          <Text style={styles.detailText}>{getCampaignDescription(campaign)}</Text>

          <View style={styles.detailMetaGrid}>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaLabel}>Availability</Text>
              <Text style={styles.detailMetaValue}>{getAvailabilityText(campaign)}</Text>
            </View>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaLabel}>Price</Text>
              <Text style={styles.detailMetaValue}>{price || 'Free'}</Text>
            </View>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaLabel}>Event</Text>
              <Text style={styles.detailMetaValue}>
                {formatDateTime(campaign?.event_date || campaign?.event_at || campaign?.starts_at) || 'TBD'}
              </Text>
            </View>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaLabel}>Ends</Text>
              <Text style={styles.detailMetaValue}>
                {formatDateTime(campaign?.ends_at || campaign?.end_date || campaign?.valid_until) || 'TBD'}
              </Text>
            </View>
          </View>

          {status === CAMPAIGN_STATUS.REDEEMED ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              onPress={() => navigation.navigate('CampaignTicketHistory')}>
              <Text style={styles.primaryButtonText}>View Ticket</Text>
            </TouchableOpacity>
          ) : status === CAMPAIGN_STATUS.RESERVED ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              disabled={paymentMutation.isPending}
              onPress={handlePayment}>
              <Text style={styles.primaryButtonText}>
                {paymentMutation.isPending ? 'Starting Payment...' : 'Continue Payment'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              disabled={reserveMutation.isPending}
              onPress={handleReserve}>
              <Text style={styles.primaryButtonText}>
                {reserveMutation.isPending ? 'Reserving...' : 'Book Ticket'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.primaryButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('CampaignTicketHistory')}>
            <Text style={[styles.primaryButtonText, styles.secondaryButtonText]}>
              Ticket History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {recommended.length > 0 && (
        <View>
          <Text style={styles.recommendedTitle}>More campaigns</Text>
          {recommended.slice(0, 3).map(item => (
            <CampaignCard
              key={getCampaignUuid(item)}
              campaign={item}
              onPress={() => navigation.replace('CampaignDetail', {campaignUuid: getCampaignUuid(item)})}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default CampaignDetail;
