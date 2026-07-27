import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

const Drawer = ({open, children, onClose}) => {
  const [show, setShow] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors: colors} = getColors();

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const slideOut = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -(screenWidth * 0.8),
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [screenWidth, slideAnim]);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(slideIn, 100);
    } else if (open !== show) {
      slideOut();
      setTimeout(slideIn, 500);
    }
  }, [open, show, slideIn, slideOut]);

  return open ? (
    <TouchableWithoutFeedback
      onPress={() => {
        slideOut();
        setTimeout(() => onClose(false), 500);
      }}>
      <View
        style={{
          height: '100%',
          position: 'absolute',
          width: '100%',
          backgroundColor: colors.transparentDrawer,
        }}>
        {/* <TouchableOpacity
          style={{
            height: '100%',
            width: '80%',
            display: 'flex'
          }}
          activeOpacity={1}> */}
          {show && (
            <Animated.View
              style={[
                {
                  height: '100%',
                  width: '84%',
                  backgroundColor: colors.surfacePrimary,
                  borderTopRightRadius: 24,
                  borderBottomRightRadius: 24,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                {
                  transform: [{translateX: slideAnim}],
                },
              ]}>
              {/* <BlurView
                blurType="light"
                blurRadius={25}
                style={{
                  // position: 'absolute',
                  display: 'flex',
                  height: 'auto',
                  width: '100%',
                }}> */}
                {children}
              {/* </BlurView> */}
            </Animated.View>
          )}
        {/* </TouchableOpacity> */}
      </View>
    </TouchableWithoutFeedback>
  ) : null;
};

export default Drawer;
