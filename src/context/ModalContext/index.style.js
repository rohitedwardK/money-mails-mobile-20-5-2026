import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import getColors from '../../utils/colors';
import {DeviceContext} from '../DeviceContext';
import {spacing} from '../../utils/theme';

export const useModalContextStyles = ({isAndroid}) => {
  const {themeColors: colors} = getColors();
  const {screenWidth, screenHeight} = useContext(DeviceContext);

  return StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      width: screenWidth,
      height: screenHeight,
      top: 0,
      left: 0,
      backgroundColor: isAndroid ? 'rgba(15, 23, 42, 0.52)' : colors.transparentDrawer,
      justifyContent: 'flex-end',
      paddingTop: spacing.xxxl,
    },
    modalContent: {
      width: '100%',
      flex: 1,
      backgroundColor: colors.surfacePrimary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
  });
};
