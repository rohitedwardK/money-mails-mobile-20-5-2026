import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import getColors from '../../../utils/colors';
import {styles as campaignStyles} from './index.style';
import {
  CAMPAIGN_STATUS,
  formatCurrency,
  getAvailabilityCount,
  getAvailabilityText,
  getCampaignImage,
  getCampaignStatus,
  getCampaignTitle,
  getStatusLabel,
} from './utils';

const CampaignStatusBadge = ({status, small = false}) => {
  const styles = campaignStyles();
  const statusStyle =
    status === CAMPAIGN_STATUS.REDEEMED
      ? styles.badgeBooked
      : status === CAMPAIGN_STATUS.RESERVED
        ? styles.badgeReserved
        : styles.badgeAvailable;

  return (
    <View style={[styles.statusBadge, small ? styles.statusBadgeSmall : null, statusStyle]}>
      <Text style={[styles.statusBadgeText, small ? styles.statusBadgeTextSmall : null]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
};

const CampaignCard = ({campaign, compact = false, onPress}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const image = getCampaignImage(campaign);
  const status = getCampaignStatus(campaign);
  const price = formatCurrency(campaign?.price ?? campaign?.ticket_price ?? campaign?.amount);
  const actionLabel =
    status === CAMPAIGN_STATUS.REDEEMED
      ? 'View Ticket'
      : status === CAMPAIGN_STATUS.RESERVED
        ? 'Continue'
        : 'Book Ticket';

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={[styles.card, styles.compactCard]}
        onPress={onPress}>
        {image ? (
          <Image source={{uri: image}} resizeMode={'cover'} style={styles.compactCardImage} />
        ) : (
          <View style={[styles.cardImageFallback, styles.compactCardImage]}>
            <EntypoIcon name={'ticket'} size={42} color={themeColors.highlightPrimary} />
          </View>
        )}
        <View style={styles.compactStatus}>
          <CampaignStatusBadge status={status} small />
        </View>
        <View style={styles.compactGradient}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {getCampaignTitle(campaign)}
          </Text>
          <View style={styles.compactBottomRow}>
            <View style={styles.compactAvailability}>
              <EntypoIcon name={'ticket'} size={18} color={themeColors.white} />
              <Text style={styles.compactAvailabilityText}>{getAvailabilityCount(campaign)}</Text>
            </View>
            <View
              style={[
                styles.compactAction,
                status === CAMPAIGN_STATUS.RESERVED ? styles.compactActionReserved : null,
                status === CAMPAIGN_STATUS.REDEEMED ? styles.compactActionBooked : null,
              ]}>
              <Text style={styles.compactActionText}>{actionLabel}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={styles.card}
      onPress={onPress}>
      <View style={styles.cardImageWrap}>
        {image ? (
          <Image source={{uri: image}} resizeMode="cover" style={styles.cardImage} />
        ) : (
          <View style={styles.cardImageFallback}>
            <EntypoIcon name="ticket" size={34} color={themeColors.highlightPrimary} />
          </View>
        )}
        <View style={styles.cardOverlayAction}>
          <Text style={styles.cardOverlayText}>
            {actionLabel}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {getCampaignTitle(campaign)}
          </Text>
          <CampaignStatusBadge status={status} />
        </View>
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMetaText}>{getAvailabilityText(campaign)}</Text>
          {!!price && <Text style={styles.cardPrice}>{price}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export {CampaignStatusBadge};
export default CampaignCard;
