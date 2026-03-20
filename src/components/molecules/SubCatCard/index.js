import React, { useState } from 'react';
import { Animated, View, Vibration, TouchableOpacity } from 'react-native';
import Button from '../../atoms/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DirectionSvgIcon from '../../../assets/images/directionIcon.svg.js';
import { subCatCardStyles } from './index.style';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import getColors from '../../../utils/colors';
import { SlideInUp, Layout } from 'react-native-reanimated';

const SubCatCard = ({
  rounded,
  src,
  size,
  maxSize,
  wrapperStyles = {},
  color,
  onFavouriteToggle,
  isFavourite = false,
  onPress,
  onActionPress,
  actionBtnOverridingStyles,
  showActionByDefault,
  disableSelect,
  children,
  item,
  activeCategory = false
}) => {
  const [isFav, setIsFav] = useState(isFavourite);
  const [isSelected, setIsSelected] = useState(activeCategory);
  const [showCardAction, setShowCardAction] = useState(showActionByDefault);
  const animate = new Animated.Value(0);

  const { themeColors: colors, iconFills } = getColors();
  const styles = subCatCardStyles({
    rounded,
    size,
    color,
    maxSize,
    isSelected,
    animate,
  });

  const singleTap = Gesture.Tap()
    .runOnJS(true)
    .maxDuration(250)
    .onEnd(() => {
      if (typeof onPress === 'function' && !showCardAction && !disableSelect) {
        setIsSelected(prevState => !prevState);
      }
      setShowCardAction(false);
    });

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

  const onFavClick = async (e) => {
    e.preventdefault();
    const favAddRes = await onFavouriteToggle(!isFav);
    setIsFav(prevState => !prevState);
  };

  return (
    // <GestureDetector
      // gesture={Gesture.Exclusive(longPress, doubleTap, singleTap)} key={item?.uuid}>
      <TouchableOpacity onPress={(e)=> onPress(!isSelected)} key={item?.uuid}>
        <View style={[styles.selectionWrapper, wrapperStyles]} key={item?.uuid}>
          <View style={styles.cardWrapper}>
            <View style={styles.imageView}>
              {src && <Image resizeMode="contain" source={src} />}
              {children}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    // </GestureDetector>
  );
};

SubCatCard.defaultProps = {
  onPress: () => void 0,
  onFavouriteToggle: false,
  onActionPress: false,
  enableLongPressAction: false,
  showActionByDefault: false,
};

export default SubCatCard;
