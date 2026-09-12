import React, { useState, useEffect } from 'react';
import { Animated, View, Vibration, TouchableOpacity, Text, Image } from 'react-native';
import Button from '../../atoms/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DirectionSvgIcon from '../../../assets/images/directionIcon.svg.js';
import { brandIconCardStyles } from './index.style';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import getColors from '../../../utils/colors';
import { SlideInUp, AnimatedLayout, runOnJS } from 'react-native-reanimated';
import { Tooltip } from 'react-native-elements';

const BrandIconCard = ({
  variant,
  rounded,
  src,
  size,
  maxSize,
  wrapperStyles = {},
  color,
  onFavouriteToggle,
  isFavourite = false,
  isActive = false,
  onPress,
  onActionPress,
  onBrandSelect,
  actionBtnOverridingStyles,
  showActionByDefault,
  disableSelect,
  children,
  item,
  showAddress,
}) => {
  const [isFav, setIsFav] = useState(isFavourite);
  const [isSelected, setIsSelected] = useState(isActive);
  const [showCardAction, setShowCardAction] = useState(showActionByDefault);
  const animate = new Animated.Value(0);

  const { themeColors: colors, iconFills } = getColors();
  const styles = brandIconCardStyles({
    variant,
    rounded,
    size,
    color,
    maxSize,
    isSelected: isActive,
    animate,
  });

  const isStoreCard = variant === 'store';
  const locationText = getLocationText(item);
  const addressText = getAddressText(item);
  const ratingText = getRatingText(item);
  const statusText = getStatusText(item);

  // const singleTap = Gesture.Tap()
  //   .runOnJS(true)
  //   // .maxDuration(250)
  //   .onEnd((e) => {
  //     // if (typeof onPress === 'function' && !showCardAction && !disableSelect) {
  //       if (typeof onPress === 'function') {
  //       setIsSelected(prevState => !prevState);
  //       onPress(!isSelected)
  //       onBrandSelect(!isSelected);
  //       setShowCardAction(true);
  //     }
  //     setShowCardAction(false);
  //   });


  const singleTap = Gesture.Tap()
    .runOnJS(true)  // Ensures JS functions can run inside gesture handlers
    .maxDuration(250)
    .numberOfTaps(1)
    .onEnd(() => {
      runOnJS(handleSingleTap)();
    });

  // Function to handle state updates in JS thread
  const handleSingleTap = () => {
    setIsSelected(prevState => !prevState);
    // onPress(!isSelected);
    onBrandSelect(!isSelected);
    setShowCardAction(true);
  };

  const doubleTap = Gesture.Tap()
    .runOnJS(true)
    .maxDuration(250)
    .numberOfTaps(2)
    .onEnd(() => {
      if (typeof onFavouriteToggle === 'function') {
        Vibration.vibrate(1);
        setIsFav(prevState => !prevState);
        setShowCardAction(false);
        onFavouriteToggle(!isFav);
        Vibration.cancel();
      }
    });

  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onStart(() => {
      setShowCardAction(true);
    });

  const onFavClick = async () => {
    // e.preventdefault();
    const favAddRes = await onFavouriteToggle(!isFav);
    setIsFav(prevState => !prevState);
  };

  if (variant === 'storeChip') {
    return (
      <GestureDetector key={item?.uuid} gesture={Gesture.Exclusive(longPress, doubleTap, singleTap)}>
        <View style={[styles.storeChipWrapper, wrapperStyles]}>
          <View style={styles.storeChipImageWrap}>
            {src ? (
              <Image resizeMode="contain" style={styles.storeChipImage} source={{ uri: `${src}` }} />
            ) : (
              <EntypoIcon name="shop" size={24} color={colors.fontMuted} />
            )}
          </View>
          <Text style={styles.storeChipName} numberOfLines={1} ellipsizeMode="tail">
            {item?.company_name || item?.name || 'Store'}
          </Text>
        </View>
      </GestureDetector>
    );
  }

  if (variant === 'storeFeature') {
    return (
      <GestureDetector key={item?.uuid} gesture={Gesture.Exclusive(longPress, doubleTap, singleTap)}>
        <View style={[styles.storeFeatureCard, wrapperStyles]}>
          <View style={styles.storeFeatureImageWrap}>
            {src ? (
              <Image resizeMode="cover" style={styles.storeFeatureImage} source={{ uri: `${src}` }} />
            ) : (
              <View style={styles.storeFeatureFallback}>
                <EntypoIcon name="shop" size={30} color={colors.fontMuted} />
              </View>
            )}
          </View>
          <View style={styles.storeFeatureBadge}>
            <Text style={styles.storeFeatureBadgeText} numberOfLines={1}>
              {item?.company_name || item?.name || 'Store'}
            </Text>
          </View>
          <View style={styles.storeFeatureFooter}>
            <EntypoIcon name="location-pin" size={12} color={colors.fontMuted} />
            <Text style={styles.storeFeatureAddress} numberOfLines={1} ellipsizeMode="tail">
              {locationText}
            </Text>
          </View>
          <View
            style={[
              styles.storeFeatureTag,
              getPartnerTag(item).isTravel ? styles.storeFeatureTagTravel : null,
            ]}>
            <Text
              style={[
                styles.storeFeatureTagText,
                getPartnerTag(item).isTravel ? styles.storeFeatureTagTextTravel : null,
              ]}>
              {getPartnerTag(item).label}
            </Text>
          </View>
        </View>
      </GestureDetector>
    );
  }

  if (isStoreCard) {
    return (
      <GestureDetector key={item?.uuid} gesture={Gesture.Exclusive(longPress, doubleTap, singleTap)}>
        <View style={[styles.selectionWrapper, wrapperStyles]} key={item?.uuid}>
          <View style={styles.cardWrapper}>
            <View style={styles.storeImageFrame}>
              {src ? (
                <Image resizeMode="contain" style={styles.storeImage} source={{ uri: `${src}` }} />
              ) : (
                <View style={styles.storeImagePlaceholder}>
                  <EntypoIcon name="shop" size={28} color={colors.fontMuted} />
                </View>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onFavClick}
                style={styles.storeFavButton}>
                <EntypoIcon
                  name={isFav ? 'heart' : 'heart-outlined'}
                  size={15}
                  color={iconFills.red}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.storeInfo}>
              <Text style={styles.storeName} numberOfLines={1} ellipsizeMode="tail">
                {item?.company_name || item?.name || 'Store'}
              </Text>
              <View style={styles.storeMetaRow}>
                <EntypoIcon name="location-pin" size={13} color={colors.fontMuted} />
                <Text style={styles.storeMetaText} numberOfLines={1} ellipsizeMode="tail">
                  {locationText}
                </Text>
              </View>
              <View style={styles.storeFooterRow}>
                <View style={styles.storeStatusPill}>
                  <EntypoIcon
                    name={ratingText ? 'star' : 'mail'}
                    size={12}
                    color={colors.highlightPrimary}
                  />
                  <Text style={styles.storeStatusText} numberOfLines={1}>
                    {ratingText || statusText}
                  </Text>
                </View>
              </View>
            </View>

            {showAddress && (
              <Tooltip
                height={72}
                width={300}
                withOverlay={false}
                toggleOnPress={true}
                popover={
                  <View>
                    <Text style={styles.storeTooltipText}>{addressText}</Text>
                  </View>
                }>
                <View
                  accessible
                  accessibilityRole="button"
                  style={styles.storeAddressButton}>
                  <DirectionSvgIcon
                    width={13}
                    height={13}
                    fill={colors.highlightPrimary}
                    style={styles.actionBtnIcon}
                  />
                  <Text style={styles.storeAddressButtonText}>View Address</Text>
                </View>
              </Tooltip>
            )}
          </View>
        </View>
      </GestureDetector>
    );
  }

  return (
    <GestureDetector key={item?.uuid} gesture={Gesture.Exclusive(longPress, doubleTap, singleTap)}>
      <View style={[styles.selectionWrapper, wrapperStyles]} key={item?.uuid}>
        <View style={styles.cardWrapper}>
          <View style={styles.imageView}>
            {src && <Image resizeMode="contain" style={{ width: '70%', height: '70%' }} source={{ uri: `${src}` }} />}
            {children}
            {!showCardAction && <Text style={{ color: 'black', fontSize: 12 }}>{item?.mails_count}</Text>}
          </View>

          <TouchableOpacity onPress={onFavClick}>
            {isFav ?
              <EntypoIcon
                name="heart"
                size={14}
                color={iconFills.red}
                style={styles.favIcon}
              /> : <EntypoIcon
                name="heart-outlined"
                size={14}
                color={iconFills.red}
                style={styles.favIcon}
              />
            }
          </TouchableOpacity>
          {showCardAction && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
            <Text style={{ color: 'black', fontSize: 12 }}>{item?.mails_count}</Text>
          </View>}
        </View>

        {showAddress && showCardAction && typeof onActionPress === 'function' && (
          <View style={{ padding: 3, backgroundColor: '#fff', marginTop: -25, marginHorizontal: 5 }}>
            <Tooltip
              height={60}
              width={300}
              withOverlay={false}
              toggleOnPress={true}
              popover={
                <View>
                  <Text style={{ color: '#fff' }}>
                    {item?.address1 || ''},
                    {item?.cities?.[0]?.name || ''},
                    {item?.counties?.[0]?.name || ''},
                    {item?.states?.[0]?.name || ''},
                    {item?.countries?.[0]?.name || ''}
                  </Text>
                </View>
              }

              // popover={<View ><Text style={{ color: '#fff' }}>{item?.address1},{item?.cities[0]?.name},{item?.counties[0]?.name},{item?.states[0]?.name},{item?.countries[0]?.name}</Text></View>}
            >
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <DirectionSvgIcon
                    width={12}
                    height={12}
                    fill={colors.black}
                    style={styles.actionBtnIcon}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 12 }}>View Address</Text>
                </View>
              </View>
            </Tooltip>
          </View>
          // <Animated.View
          //   entering={SlideInUp.duration(150)}
          //   layout={AnimatedLayout?.springify()}
          //   style={styles.actionWrapper}>
          //   <View
          //     style={{
          //       // position: 'absolute',
          //       right: 2,
          //       alignItems: 'flex-end',
          //       top: -50, // Adjust as needed
          //     }}
          //   >
          //     <Tooltip
          //       height={80}
          //       width={300}
          //       withOverlay={false}
          //       toggleOnPress={true}
          //       popover={<Text>Identity Type and Upload ID Proof: Verifies your identity to ensure you’re a
          //         real and unique user.</Text>}>
          //       <Text>


          //         <Button
          //           btnText="View Address"
          //           size="small"
          //           variant="secondary"
          //           btnTextOverrideStyles={{
          //             fontSize: 9,
          //             color: colors.fontPrimary,
          //           }}
          //           startIcon={
          //             <DirectionSvgIcon
          //               width={12}
          //               height={12}
          //               fill={colors.black}
          //               style={styles.actionBtnIcon}
          //             />
          //           }
          //           onPress={onActionPress}
          //           overridingStyles={{
          //             ...styles.actionBtn,
          //             ...actionBtnOverridingStyles,
          //           }}
          //         />
          //       </Text>
          //     </Tooltip>
          //   </View>
          // </Animated.View>
        )}
      </View>
    </GestureDetector>
  );
};

BrandIconCard.defaultProps = {
  variant: 'default',
  onPress: () => void 0,
  onFavouriteToggle: false,
  onActionPress: false,
  enableLongPressAction: false,
  showActionByDefault: false,
};

const getPartnerTag = item => {
  const category =
    item?.categories?.[0]?.name ||
    item?.category?.name ||
    item?.category_name ||
    item?.type ||
    '';
  const label = String(category || 'Travel').trim() || 'Travel';
  const isTravel = /travel|holiday|kayak/i.test(`${label} ${item?.company_name || item?.name || ''}`);
  const isFlight = /flight|air/i.test(`${label} ${item?.company_name || item?.name || ''}`);

  return {
    label: isFlight ? 'Flights' : isTravel ? 'Travel' : label,
    isTravel: !isFlight,
  };
};

const getFirstName = list => (Array.isArray(list) && list[0]?.name ? list[0].name : '');

const getLocationText = item => {
  const distance = item?.distance || item?.distance_text || item?.distanceText;
  const city = getFirstName(item?.cities);
  const county = getFirstName(item?.counties);
  const state = getFirstName(item?.states);
  const place = [city, county || state].filter(Boolean).join(', ');

  if (distance && place) {
    return `${distance} • ${place}`;
  }

  return distance || place || 'Nearby';
};

const getAddressText = item => {
  const addressParts = [
    item?.address1,
    getFirstName(item?.cities),
    getFirstName(item?.counties),
    getFirstName(item?.states),
    getFirstName(item?.countries),
  ].filter(Boolean);

  return addressParts.length ? addressParts.join(', ') : 'Address unavailable';
};

const getRatingText = item => {
  const rating = item?.rating || item?.avg_rating || item?.average_rating;
  return rating ? `${rating} rating` : '';
};

const getStatusText = item => {
  if (item?.is_highlight === 'true' || item?.is_highlight === true) {
    return 'Featured';
  }

  const mailCount = Number(item?.mails_count || 0);
  return `${mailCount} ${mailCount === 1 ? 'mail' : 'mails'}`;
};

export default BrandIconCard;
