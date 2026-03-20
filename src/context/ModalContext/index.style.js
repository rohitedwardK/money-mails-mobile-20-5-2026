import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import getColors from '../../utils/colors';
import {DeviceContext} from '../DeviceContext';

export const modalContextStyles = ({isAndroid}) => {
  const {themeColors: colors} = getColors();
  const {screenWidth, screenHeight} = useContext(DeviceContext);

  return StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      width: screenWidth,
      height: screenHeight,
      top: 0,
      left: 0,
      backgroundColor : "#FFFFFF",
      // backgroundColor: isAndroid
      //   ? 'rgba(0, 0, 0, 0.7)'
      //   : colors.transparentDrawer,
      paddingTop: 80,
    },
    modalContent: {
      width: '100%',
      height: '100%',
    },
  });
};
