import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const appBarStyles = ({isAndroid}) => {
  const {themeColors: colors, isDarkMode} = getColors();

  return StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      // height: 62,
      flexDirection: 'row',
      // paddingHorizontal: 12,
      backgroundColor: 'transparent',
      width: '100%',
      // ...(isDarkMode
      //   ? {
      //       borderBottomWidth: 0.2,
      //       borderBottomColor: colors.white,
      //     }
      //   : {}),
      // ...(isAndroid
      //   ? {
      //       marginTop: 24,
      //     }
      //   : {}),
    },
    brand: {
      width: 124,
      height: 30,
      marginTop: -10,
      marginLeft: 34,
    },
    notificationIcon: {
      marginLeft: 'auto',
    },
  });
};
