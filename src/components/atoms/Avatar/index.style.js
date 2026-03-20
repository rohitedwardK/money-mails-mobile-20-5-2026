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
      ...(!flatStyle
        ? {
            shadowColor: avatarColors.shadowColor,
            shadowOffset: {width: 12, height: 12},
            shadowOpacity: 1,
            shadowRadius: 20,
          }
        : {}),
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
      margin: 35,
      width: '100%',
      height: '100%',
      resizeMode: fit,
      alignItems:'center',
      borderRadius: rounded ? 500 : 28,
      fontSize: 22,
    color:"black",
    }
  });
};
