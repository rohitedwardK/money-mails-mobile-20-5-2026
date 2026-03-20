import React, {useContext, useEffect, useRef, useState} from 'react';
import {BlurView} from '@react-native-community/blur';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';

const Drawer = ({open, children, onClose}) => {
  const [show, setShow] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const {screenWidth} = useContext(DeviceContext);

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: -(screenWidth * 0.8),
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(slideIn, 100);
    } else if (open !== show) {
      slideOut();
      setTimeout(slideIn, 500);
    }
  }, [open]);

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
                  width: '80%',
                  backgroundColor: 'rgba(255,255,255, 1)',
                  borderRightWidth: 1,
                  borderRightColor: 'white',
                  shadowColor: '#00000014',
                  shadowOffset: {width: 23, height: 34},
                  shadowOpacity: 1,
                  shadowRadius: 30,
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
