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

const OfferCard = ({ onTap, size, maxSize, isRedeemed, containerStyles, isFavourite, item, onFavouriteToggle }) => {
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


  return (
    // <GestureDetector key={item?.uuid}>
    <TouchableOpacity style={[styles.container, containerStyles]} onPress={onTap}>
      <View style={styles.wrapper}>
        <View style={styles.cardHeaderWrapper}>
          <View>{item?.type === 'paid' ? <Icon name="crown" size={30} className={`fa-2x fa-regular`} color="#FFB833" light /> : <Icon name="chess-queen" size={30} className={`fa-2x fa-regular`} color="#54ac34" light />}</View>
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
                style={{ width: 30, height: 30 }} source={{ uri: `${item?.brand[0]?.logo_url || item?.image_url}` }} /> : item?.mime_type === 'application/icon' ? <NikeSVG width="70%" height="70%" /> : <Image resizeMode="cover"
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
  status: NEW_OFFER,
  onTap: void 0,
  offerDetails: {},
};

export default OfferCard;
