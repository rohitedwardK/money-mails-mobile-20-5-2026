import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {DeviceContext} from '../../../context/DeviceContext';

const VISIBLE_CARDS = 4;
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 8;

const getCoverImage = item =>
  item?.banner_url ||
  item?.banner ||
  item?.cover_image ||
  item?.image_url ||
  item?.image ||
  item?.logo_url ||
  '';

const HomeStoreCard = ({item, isActive, onPress}) => {
  const {screenWidth} = useContext(DeviceContext);
  const cardWidth = Math.floor(
    (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP * (VISIBLE_CARDS - 1)) /
      VISIBLE_CARDS,
  );
  const cardHeight = Math.max(104, Math.round(cardWidth * 1.18));
  const image = getCoverImage(item);
  const name = item?.company_name || item?.name || 'Store';
  const isLogoOnly = image === item?.logo_url;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {width: cardWidth, height: cardHeight, marginRight: CARD_GAP},
        isActive ? styles.cardActive : null,
      ]}>
      {image ? (
        <Image
          source={{uri: image}}
          resizeMode={isLogoOnly ? 'contain' : 'cover'}
          style={[styles.image, isLogoOnly ? styles.logoImage : null]}
        />
      ) : (
        <View style={styles.fallback}>
          <EntypoIcon name="shop" size={22} color="#9CA3AF" />
        </View>
      )}
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardActive: {
    borderColor: '#1F8A4C',
    borderWidth: 2,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoImage: {
    backgroundColor: '#F3F4F6',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: 'rgba(12, 18, 22, 0.48)',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
  },
});

export default HomeStoreCard;
