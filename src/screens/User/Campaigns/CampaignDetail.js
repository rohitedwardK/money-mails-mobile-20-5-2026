import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  formatEventDateRange,
  getAvailabilityCount,
  getAvailabilityLeftText,
  getCampaignDescription,
  getCampaignFeatures,
  getCampaignImage,
  getCampaignLocation,
  getCampaignStatus,
  getCampaignTitle,
  getCampaignUuid,
  getPaymentUrl,
  getTicketTypeLabel,
  openPaymentUrl,
} from './utils';

const CampaignDetail = ({navigation, route}) => {
  const styles = campaignStyles();
  const insets = useSafeAreaInsets();
  const {themeColors} = getColors();
  const campaignUuid = route?.params?.campaignUuid;
  const {data, isLoading, error} = useCampaignDetail({campaignUuid});
  const reserveMutation = useReserveCampaignTicket(campaignUuid);
  const paymentMutation = useInitCampaignPayment(campaignUuid);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const campaign = data?.data || data?.campaign || data || {};
  const status = getCampaignStatus(campaign);
  const image = getCampaignImage(campaign);
  const price = formatCurrency(campaign?.price ?? campaign?.ticket_price ?? campaign?.amount);
  const description = getCampaignDescription(campaign);
  const features = getCampaignFeatures(campaign);
  const recommended = getCollection(data?.recommended || data?.related).filter(
    item => getCampaignUuid(item) !== campaignUuid,
  );
  const availabilityCount = String(getAvailabilityCount(campaign));

  const openPayment = async payload => {
    const url = getPaymentUrl(payload);
    if (url) {
      await openPaymentUrl(url);
    }
  };

  const handleReserveOnly = async () => {
    try {
      await reserveMutation.mutateAsync();
      Toast.show('Ticket reserved.', Toast.SHORT);
    } catch (err) {
      Toast.show(err?.message || 'Unable to reserve ticket.', Toast.LONG);
    }
  };

  const handleBookTicket = async () => {
    try {
      if (status === CAMPAIGN_STATUS.REDEEMED) {
        navigation.navigate('CampaignTicketHistory');
        return;
      }

      if (status === CAMPAIGN_STATUS.RESERVED) {
        const payload = await paymentMutation.mutateAsync();
        const url = getPaymentUrl(payload);
        if (url) {
          await openPaymentUrl(url);
        } else {
          Toast.show('Payment initialized.', Toast.SHORT);
        }
        return;
      }

      const payload = await reserveMutation.mutateAsync();
      Toast.show('Ticket reserved.', Toast.SHORT);
      await openPayment(payload);
    } catch (err) {
      Toast.show(err?.message || 'Unable to complete booking.', Toast.LONG);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${getCampaignTitle(campaign)} - ${getCampaignLocation(campaign)}`,
      });
    } catch (_err) {
      // User dismissed share sheet.
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.screenSurface, styles.stateBox]}>
        <ActivityIndicator color={themeColors.highlightPrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.screenSurface, styles.stateBox]}>
        <Text style={styles.stateTitle}>Campaign unavailable</Text>
        <Text style={styles.stateText}>{error.message}</Text>
      </View>
    );
  }

  const isBooked = status === CAMPAIGN_STATUS.REDEEMED;
  const isReserved = status === CAMPAIGN_STATUS.RESERVED;
  const isActionPending = reserveMutation.isPending || paymentMutation.isPending;

  return (
    <View style={[styles.screen, styles.screenSurface]}>
      <ScrollView
        contentContainerStyle={[
          styles.detailScrollContent,
          {paddingBottom: 110 + insets.bottom},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeroWrap}>
          {image ? (
            <Image source={{uri: image}} resizeMode="cover" style={styles.detailHeroImage} />
          ) : (
            <View style={[styles.detailHeroImage, styles.cardImageFallback]}>
              <EntypoIcon name="ticket" size={42} color={themeColors.highlightPrimary} />
            </View>
          )}

          <View style={[styles.detailHeroTopBar, {paddingTop: insets.top + 8}]}>
            <TouchableOpacity
              style={styles.detailHeroButton}
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.detailHeroTopActions}>
              <TouchableOpacity
                style={styles.detailHeroButton}
                onPress={handleShare}
                accessibilityLabel="Share campaign">
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailHeroBadge}>
            <CampaignStatusBadge status={status} small onImage />
          </View>
        </View>

        <View style={styles.detailContent}>
          <View style={styles.detailTitleRow}>
            <Text style={styles.detailTitle}>{getCampaignTitle(campaign)}</Text>
            <View style={styles.detailPriceCol}>
              <Text style={styles.detailPrice}>{price || 'Free'}</Text>
              <Text style={styles.detailPriceHint}>per ticket</Text>
            </View>
          </View>

          <View style={styles.detailMetaList}>
            <View style={styles.detailMetaItem}>
              <Ionicons name="location-outline" size={15} color="#6B7280" />
              <Text style={styles.detailMetaItemText}>{getCampaignLocation(campaign)}</Text>
            </View>
            <View style={styles.detailMetaItem}>
              <Ionicons name="calendar-outline" size={15} color="#6B7280" />
              <Text style={styles.detailMetaItemText}>{formatEventDateRange(campaign)}</Text>
            </View>
          </View>

          <View style={styles.detailTicketsBox}>
            <Text style={styles.detailTicketsLabel}>Tickets left</Text>
            <Text style={styles.detailTicketsValue}>
              {availabilityCount.includes('/')
                ? availabilityCount.replace('/', ' / ')
                : availabilityCount}
            </Text>
          </View>

          <View style={styles.detailFeaturesRow}>
            {features.slice(0, 4).map(feature => (
              <View key={feature.label} style={styles.detailFeatureItem}>
                <View style={styles.detailFeatureIcon}>
                  <Ionicons
                    name={feature.icon || 'ellipse-outline'}
                    size={18}
                    color={themeColors.highlightPrimary}
                  />
                </View>
                <Text style={styles.detailFeatureLabel} numberOfLines={2}>
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>About the event</Text>
            <Text
              style={styles.detailDescription}
              numberOfLines={showFullDescription ? undefined : 3}>
              {description}
            </Text>
            {description.length > 120 && (
              <TouchableOpacity onPress={() => setShowFullDescription(current => !current)}>
                <Text style={styles.detailReadMore}>
                  {showFullDescription ? 'Show less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Your tickets</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.detailTicketCard}
              onPress={() => navigation.navigate('CampaignTicketHistory')}>
              <View style={styles.detailTicketIcon}>
                <Ionicons name="ticket-outline" size={20} color={themeColors.highlightPrimary} />
              </View>
              <View style={styles.detailTicketCopy}>
                <Text style={styles.detailTicketTitle}>{getTicketTypeLabel(campaign)}</Text>
                <Text style={styles.detailTicketSubtitle}>
                  {isBooked
                    ? 'Ticket booked'
                    : isReserved
                      ? `${getAvailabilityLeftText(campaign)} reserved`
                      : getAvailabilityLeftText(campaign)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {recommended.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>You might also like</Text>
              {recommended.slice(0, 2).map(item => (
                <CampaignCard
                  key={getCampaignUuid(item)}
                  variant="list"
                  campaign={item}
                  onPress={() =>
                    navigation.replace('CampaignDetail', {campaignUuid: getCampaignUuid(item)})
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.detailFooter, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        {!isBooked && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.detailFooterButton, styles.detailFooterButtonOutline]}
            disabled={isActionPending || isReserved}
            onPress={handleReserveOnly}>
            <Text style={styles.detailFooterButtonOutlineText}>
              {reserveMutation.isPending ? 'Reserving...' : 'Reserve'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.detailFooterButton,
            styles.detailFooterButtonPrimary,
            isBooked ? styles.detailFooterButtonFull : null,
          ]}
          disabled={isActionPending}
          onPress={handleBookTicket}>
          <Text style={styles.detailFooterButtonPrimaryText}>
            {paymentMutation.isPending
              ? 'Starting payment...'
              : isBooked
                ? 'View ticket'
                : isReserved
                  ? 'Continue payment'
                  : reserveMutation.isPending
                    ? 'Booking...'
                    : 'Book ticket'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CampaignDetail;
