import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const avatarStyles = ({size, rounded, fit, flatStyle}) => {
  const {avatarColors} = getColors();

  return StyleSheet.create({
    wrapper: {
      width: size,
      height: size,
      padding: flatStyle ? 0 : 3,
      borderRadius: rounded ? 500 : 28,
      backgroundColor: '#009999' , //avatarColors.wrapperBg,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      shadowOpacity: 0,
      elevation: 0,
    },
    dp: {
      width: '100%',
      height: '100%',
      resizeMode: fit,
      borderRadius: rounded ? 500 : 28,
    },
    statusIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '25%',
      height: '25%',
      borderRadius: 500,
      borderWidth: 3,
      borderColor: avatarColors.wrapperBg,
      backgroundColor: avatarColors.statusIndicator,
    },
    initial: {
      color: 'black',
      fontSize: Math.max(14, size * 0.24),
      fontWeight: '800',
      lineHeight: Math.max(18, size * 0.3),
      textAlign: 'center',
      borderRadius: rounded ? 500 : 28,
    },
  });
};
