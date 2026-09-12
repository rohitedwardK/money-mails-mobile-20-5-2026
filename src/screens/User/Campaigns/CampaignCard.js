import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getColors from '../../../utils/colors';
import {styles as campaignStyles} from './index.style';
import {
  CAMPAIGN_STATUS,
  formatCurrency,
  formatEventDateRange,
  getAvailabilityCount,
  getAvailabilityLeftText,
  getCampaignImage,
  getCampaignLocation,
  getCampaignStatus,
  getCampaignTitle,
  getStatusLabel,
} from './utils';

const CampaignStatusBadge = ({status, small = false, onImage = false}) => {
  const styles = campaignStyles();
  const statusStyle =
    status === CAMPAIGN_STATUS.REDEEMED
      ? styles.badgeBooked
      : status === CAMPAIGN_STATUS.RESERVED
        ? styles.badgeReserved
        : onImage
          ? styles.badgeAvailableOnImage
          : styles.badgeAvailable;

  const isAvailable = status !== CAMPAIGN_STATUS.REDEEMED && status !== CAMPAIGN_STATUS.RESERVED;

  return (
    <View style={[styles.statusBadge, small ? styles.statusBadgeSmall : null, statusStyle]}>
      <Text
        style={[
          styles.statusBadgeText,
          small ? styles.statusBadgeTextSmall : null,
          isAvailable ? styles.statusBadgeTextAvailable : null,
          status === CAMPAIGN_STATUS.RESERVED ? styles.statusBadgeTextReserved : null,
          status === CAMPAIGN_STATUS.REDEEMED ? styles.statusBadgeTextBooked : null,
        ]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
};

const getActionLabel = status => {
  if (status === CAMPAIGN_STATUS.REDEEMED) {
    return 'View ticket';
  }
  if (status === CAMPAIGN_STATUS.RESERVED) {
    return 'Continue payment';
  }
  return 'Book ticket';
};

const CampaignCard = ({campaign, compact = false, variant = 'default', onPress}) => {
  const styles = campaignStyles();
  const {themeColors} = getColors();
  const image = getCampaignImage(campaign);
  const status = getCampaignStatus(campaign);
  const price = formatCurrency(campaign?.price ?? campaign?.ticket_price ?? campaign?.amount);
  const actionLabel = getActionLabel(status);

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
          <CampaignStatusBadge status={status} small onImage />
        </View>
        <View style={styles.compactGradient}>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {getCampaignTitle(campaign)}
          </Text>
          <Text style={styles.compactAvailabilityText}>
            {getAvailabilityLeftText(campaign)}
          </Text>
          <View style={styles.compactBottomRow}>
            <View style={styles.compactAvatars}>
              {['#F4B183', '#7FB3D5', '#82E0AA'].map((bg, index) => (
                <View
                  key={bg}
                  style={[styles.compactAvatar, {backgroundColor: bg, zIndex: 3 - index, marginLeft: index === 0 ? 0 : -6}]}
                />
              ))}
              <View style={[styles.compactAvatar, styles.compactAvatarMore]}>
                <Text style={styles.compactAvatarText}>+12</Text>
              </View>
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

  if (variant === 'list') {
    return (
      <TouchableOpacity activeOpacity={0.88} style={styles.listCard} onPress={onPress}>
        <View style={styles.listCardImageWrap}>
          {image ? (
            <Image source={{uri: image}} resizeMode="cover" style={styles.listCardImage} />
          ) : (
            <View style={[styles.listCardImage, styles.cardImageFallback]}>
              <EntypoIcon name="ticket" size={28} color={themeColors.highlightPrimary} />
            </View>
          )}
          <View style={styles.listCardBadge}>
            <CampaignStatusBadge status={status} small onImage />
          </View>
        </View>

        <View style={styles.listCardBody}>
          <Text style={styles.listCardTitle} numberOfLines={2}>
            {getCampaignTitle(campaign)}
          </Text>

          <View style={styles.listCardMetaRow}>
            <Ionicons name="location-outline" size={13} color="#9CA3AF" />
            <Text style={styles.listCardMetaText} numberOfLines={1}>
              {getCampaignLocation(campaign)}
            </Text>
          </View>

          <View style={styles.listCardMetaRow}>
            <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
            <Text style={styles.listCardMetaText} numberOfLines={1}>
              {formatEventDateRange(campaign)}
            </Text>
          </View>

          <View style={styles.listCardFooter}>
            <View style={styles.listCardPriceCol}>
              {!!price && <Text style={styles.listCardPrice}>{price}</Text>}
              <Text style={styles.listCardAvailability}>{getAvailabilityLeftText(campaign)}</Text>
            </View>
            <View style={styles.listCardAction}>
              <Text style={styles.listCardActionText}>{actionLabel}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={onPress}>
      <View style={styles.cardImageWrap}>
        {image ? (
          <Image source={{uri: image}} resizeMode="cover" style={styles.cardImage} />
        ) : (
          <View style={styles.cardImageFallback}>
            <EntypoIcon name="ticket" size={34} color={themeColors.highlightPrimary} />
          </View>
        )}
        <View style={styles.cardOverlayAction}>
          <Text style={styles.cardOverlayText}>{actionLabel}</Text>
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
          <Text style={styles.cardMetaText}>{getAvailabilityLeftText(campaign)}</Text>
          {!!price && <Text style={styles.cardPrice}>{price}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export {CampaignStatusBadge};
export default CampaignCard;
