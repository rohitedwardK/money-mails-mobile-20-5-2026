import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pdf from 'react-native-pdf';
import {MailMessage, MailHtmlBody} from '../../molecules/MailHtmlContent';
import {mailDetailStyles} from './index.style';

const MailDetailModal = ({
  offerCard = {},
  mailHTML,
  screenWidth,
  screenHeight,
  onClose,
  seconds = 0,
  renderVideo,
}) => {
  const styles = mailDetailStyles({screenWidth, screenHeight});
  const brand = Array.isArray(offerCard?.brand)
    ? offerCard.brand[0]
    : offerCard?.brand;
  const mimeType = offerCard?.mime_type || '';
  const isHtml = mimeType === 'text/html';
  const isPdf = mimeType === 'application/pdf';
  const isImage = mimeType === 'image/png' || mimeType === 'image/jpeg';
  const hasVideo = !!offerCard?.video_url && !isHtml && !isPdf && !isImage;
  const isRedeeming = seconds > 0;
  const mediaHeight = Math.round(screenHeight * 0.52);

  const renderMedia = () => {
    if (isHtml) {
      return (
        <View style={styles.htmlContainer}>
          <MailHtmlBody
            mailHTML={mailHTML}
            screenWidth={screenWidth}
            height={mediaHeight}
          />
        </View>
      );
    }

    if (isPdf && offerCard?.image_url) {
      return (
        <View style={[styles.mediaSection, styles.pdfContainer, {height: mediaHeight}]}>
          <Pdf
            source={{uri: offerCard.image_url, cache: true}}
            trustAllCerts={false}
            style={{flex: 1, width: '100%', height: mediaHeight}}
          />
        </View>
      );
    }

    if (isImage && offerCard?.image_url) {
      return (
        <View style={styles.mediaSection}>
          <Image
            resizeMode="contain"
            style={styles.mailImage}
            source={{uri: offerCard.image_url}}
          />
        </View>
      );
    }

    if (hasVideo && renderVideo) {
      return (
        <View style={[styles.mediaSection, styles.videoContainer, {minHeight: mediaHeight}]}>
          {renderVideo(offerCard.video_url)}
        </View>
      );
    }

    if (!offerCard?.message && !isHtml) {
      return (
        <View style={styles.emptyMedia}>
          <Text style={styles.emptyMediaText}>No file available</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isRedeeming ? (
          <Text style={styles.waitText}>Please Wait...</Text>
        ) : (
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            activeOpacity={0.85}>
            <EntypoIcon name="chevron-left" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled">
        <View style={styles.storeRow}>
          {brand?.logo_url ? (
            <Image
              source={{uri: brand.logo_url}}
              style={styles.storeLogo}
              resizeMode="cover"
            />
          ) : null}
          <View style={styles.storeInfo}>
            {!!brand?.company_name && (
              <Text style={styles.storeName} numberOfLines={1}>
                {brand.company_name}
              </Text>
            )}
            {!!offerCard?.subject && (
              <Text style={styles.subject} numberOfLines={2}>
                {offerCard.subject}
              </Text>
            )}
            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.badge,
                  offerCard?.type === 'paid'
                    ? styles.badgePaid
                    : styles.badgeRegular,
                ]}>
                <Text style={styles.badgeText}>
                  {offerCard?.type === 'paid' ? 'Paid Mail' : 'Regular Mail'}
                </Text>
              </View>
              {offerCard?.type === 'paid' && Number(offerCard?.amount) > 0 && (
                <View style={styles.amountBadge}>
                  <Text style={styles.amountText}>
                    {offerCard.amount} Points
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.messageSection}>
          <MailMessage message={offerCard?.message} screenWidth={screenWidth} />
        </View>

        {renderMedia()}
      </ScrollView>
    </View>
  );
};

export default MailDetailModal;
