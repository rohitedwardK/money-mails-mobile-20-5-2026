import React, { useState, useEffect } from 'react';
import { Animated, View, Vibration, TouchableOpacity, Text, Image } from 'react-native';
import Button from '../../atoms/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DirectionSvgIcon from '../../../assets/images/directionIcon.svg.js';
import { brandIconCardStyles } from './index.style';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import getColors from '../../../utils/colors';
import { SlideInUp, AnimatedLayout, runOnJS } from 'react-native-reanimated';
import { Tooltip } from "react-native-elements";

const BrandIconCard = ({
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
  showAddress
}) => {
  const [isFav, setIsFav] = useState(isFavourite);
  const [isSelected, setIsSelected] = useState(isActive);
  const [showCardAction, setShowCardAction] = useState(showActionByDefault);
  const animate = new Animated.Value(0);

  const { themeColors: colors, iconFills } = getColors();
  const styles = brandIconCardStyles({
    rounded,
    size,
    color,
    maxSize,
    isSelected: isActive,
    animate,
  });

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
                    {item?.address1 || ""},
                    {item?.cities?.[0]?.name || ""},
                    {item?.counties?.[0]?.name || ""},
                    {item?.states?.[0]?.name || ""},
                    {item?.countries?.[0]?.name || ""}
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
  onPress: () => void 0,
  onFavouriteToggle: false,
  onActionPress: false,
  enableLongPressAction: false,
  showActionByDefault: false,
};

export default BrandIconCard;
