import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { offerCardStyles } from './index.style.js';
// import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { NEW_OFFER } from '../../../constants';
import BrandIconCard from '../../molecules/BrandIconCard';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import NikeBrandSvg from '../../../assets/images/brandsIcons/nike.svg.js';
// import CrownIconSVG from '../../../assets/images/crownIcon.svg.js';
import JewelIconSVG from '../../../assets/images/jewelIcon.svg.js';
import getColors from '../../../utils/colors';

const OfferCard = ({ variant, onTap, size, maxSize, isRedeemed, containerStyles, isFavourite, item, onFavouriteToggle }) => {
  const [isFav, setIsFav] = useState(isFavourite);
  const { themeColors: colors, iconFills } = getColors();
  const styles = offerCardStyles({
    size,
    maxSize,
    containerStyles,
  });

  // const singleTap = Gesture.Tap()
  //   .runOnJS(true)
  //   .maxDuration(250)
  //   .onEnd(() => {
  //     // onTap();
  //   });
  const flat = item?.subject?.split(' ') || [];

  const onFavClick = async (e) => {
    await onFavouriteToggle(!isFav);
    setIsFav(prevState => !prevState);
  };

  const brand = Array.isArray(item?.brand) ? item.brand[0] : item?.brand;
  const imageUrl = item?.image_url || item?.image || brand?.logo_url;
  const rewardImageUrl = item?.reward_image || item?.mail_image || item?.mails?.[0]?.image_url || item?.image_url || item?.image;
  const brandLogoUrl = brand?.logo_url || item?.brand_logo || item?.logo_url;
  const title = item?.subject || item?.title || brand?.company_name || 'Mail offer';
  const brandName = brand?.company_name || item?.brand_name || 'Money Mails';
  const statusText = isRedeemed ? (item?.type === 'paid' ? 'Redeemed' : 'Seen') : 'New';
  const offerText = item?.description || item?.offer || item?.short_description || 'Tap to view details';

  if (variant === 'feed') {

    return (
      <TouchableOpacity style={[styles.feedContainer, containerStyles]} onPress={onTap} activeOpacity={0.9}>
        <View style={styles.feedImageWrap}>
          {imageUrl ? (
            <Image resizeMode="cover" style={styles.feedImage} source={{ uri: `${imageUrl}` }} />
          ) : (
            <View style={styles.feedImageFallback}>
              <Icon name={item?.type === 'paid' ? 'crown' : 'envelope-open-text'} size={34} color={colors.highlightPrimary} />
            </View>
          )}
          <TouchableOpacity onPress={onFavClick} style={styles.feedFavButton} activeOpacity={0.8}>
            <EntypoIcon
              name={isFav ? 'heart' : 'heart-outlined'}
              size={17}
              color={isFav ? iconFills.red : colors.fontPrimary}
            />
          </TouchableOpacity>
          <View style={styles.feedBadge}>
            <Text style={styles.feedBadgeText}>{statusText}</Text>
          </View>
        </View>
        <View style={styles.feedBody}>
          <Text style={styles.feedTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <View style={styles.feedMetaRow}>
            <Icon name="store" size={11} color={colors.highlightPrimary} />
            <Text style={styles.feedMetaText} numberOfLines={1} ellipsizeMode="tail">{brandName}</Text>
          </View>
          <View style={styles.feedFooterRow}>
            <Text style={styles.feedOfferText} numberOfLines={1} ellipsizeMode="tail">{offerText}</Text>
            <View style={styles.feedTypePill}>
              <Text style={styles.feedTypeText}>{item?.type === 'paid' ? 'Paid' : 'Mail'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'reward') {
    return (
      <TouchableOpacity style={[styles.rewardContainer, containerStyles]} onPress={onTap} activeOpacity={0.9}>
        {rewardImageUrl || brandLogoUrl ? (
          <Image resizeMode="cover" style={styles.rewardBackgroundImage} source={{uri: `${rewardImageUrl || brandLogoUrl}`}} />
        ) : (
          <View style={styles.rewardImageFallback}>
            <Icon name={item?.type === 'paid' ? 'crown' : 'envelope-open-text'} size={42} color={colors.highlightPrimary} />
          </View>
        )}
        <View style={styles.rewardImageOverlay} />
        <View style={styles.rewardHeader}>
          <View style={styles.rewardIconBadge}>
            <Icon
              name={item?.type === 'paid' ? 'crown' : 'envelope-open-text'}
              size={20}
              color={item?.type === 'paid' ? '#FFB833' : colors.white}
            />
          </View>
          <TouchableOpacity onPress={onFavClick} style={styles.rewardFavButton} activeOpacity={0.8}>
            <EntypoIcon
              name={isFav ? 'heart' : 'heart-outlined'}
              size={17}
              color={isFav ? iconFills.red : colors.white}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rewardOverlayContent}>
          {brandLogoUrl ? (
            <View style={styles.rewardBrandLogoBadge}>
              <Image resizeMode="contain" style={styles.rewardBrandLogo} source={{ uri: `${brandLogoUrl}` }} />
            </View>
          ) : null}
          <Text style={styles.rewardTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.rewardOfferText} numberOfLines={2}>{offerText}</Text>
          <View style={styles.rewardMetaRow}>
            <Text style={styles.rewardBrand} numberOfLines={1}>{brandName}</Text>
            <View style={styles.rewardFooter}>
              <Text style={styles.rewardStatusText}>{statusText}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  return (
    // <GestureDetector key={item?.uuid}>
    <TouchableOpacity style={[styles.container, containerStyles]} onPress={onTap}>
      <View style={styles.wrapper}>
        <View style={styles.cardHeaderWrapper}>
          <View>{item?.type === 'paid' ? <Icon name="crown" size={30} className={'fa-2x fa-regular'} color="#FFB833" light /> : <Icon name="chess-queen" size={30} className={'fa-2x fa-regular'} color="#54ac34" light />}</View>
          <View>
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
          </View>
          <View>
            {item?.mime_type === 'image/png' || item?.mime_type === 'image/jpeg' ? <Image resizeMode="cover"
              style={{ width: 30, height: 30 }} source={{ uri: `${item?.brand[0]?.logo_url || item?.image_url}` }} /> : item?.mime_type === 'application/pdf' ? <Image resizeMode="cover"
                style={{ width: 30, height: 30 }} source={{ uri: `${item?.brand[0]?.logo_url || item?.image_url}` }} /> : item?.mime_type === 'application/icon' ? <Icon name="envelope-open-text" size={24} color={colors.highlightPrimary} /> : <Image resizeMode="cover"
                  style={{ width: 30, height: 30 }} source={{ uri: `${item?.brand[0]?.logo_url || item?.image_url}` }} />}
          </View>
        </View>
        <TouchableOpacity onPress={onTap} style={{ alignItems: 'center' }}>
          <View style={styles.offerTitleWrapper}>
            <Text style={styles.offerTitle}>{flat[0]}</Text>
            <Text style={styles.offerSubText}>{flat[1]}</Text>
          </View>
          <View style={isRedeemed ? { opacity: 0.2 } : {}}>

            {!isRedeemed && item.type == 'paid' && (<>
              <JewelIconSVG width={70} height={70} style={{ marginTop: 1 }} />
              <Text style={[styles.cardFooterText, { marginLeft: 15 }]}>Unseen</Text></>
            )}
            {!isRedeemed && item.type !== 'paid' && (<>
              <JewelIconSVG width={70} height={70} style={{ marginTop: 1 }} />
              <Text style={[styles.cardFooterText, { marginLeft: 15 }]}>Unseen</Text></>
            )}

          </View>

          {(isRedeemed && item?.type === 'paid') && <Text style={styles.redeemTag}>Redeemed</Text>}
          {(isRedeemed && item?.type != 'paid') &&
            // <EntypoIcon
            //   name="eye"
            //   size={22}
            //   style={styles.redeemTag}
            // />
            <>
              {/* <JewelIconSVG width={70} height={70} style={{ marginTop: 1 }} />
              <Text style={[styles.cardFooterText, { marginLeft: 0 }]}>seen</Text> */}
              <Text style={styles.redeemTag}>Seen</Text>
            </>
          }
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
    // {/* </GestureDetector> */}
  );
};

OfferCard.defaultProps = {
  variant: 'default',
  status: NEW_OFFER,
  onTap: void 0,
  offerDetails: {},
};

export default OfferCard;
