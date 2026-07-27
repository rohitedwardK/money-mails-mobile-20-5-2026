import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const tabViewStyles = () => {
  const {themeColors: colors, tabBarColors, isDarkMode} = getColors();

  return StyleSheet.create({
    container: {
      marginTop: 38,
      backgroundColor: colors.white,
    },
    tabBar: {
      flexDirection: 'row',
      marginHorizontal: 10,
      backgroundColor: colors.bgPrimary,

      ...(isDarkMode
        ? {
            borderBottomWidth: 0.2,
            borderBottomColor: colors.white,
          }
        : {
            shadowOpacity: 0,
            elevation: 0,
          }),
    },
    tabItem: {
      width: 'auto',
    },
    tabBarIndicator: {backgroundColor: tabBarColors.indicatorColor},
    tabBarLabels: {
      fontSize: 13,
    },
    tabBarContainer: {
      backgroundColor: 'transparent',
    },
    tabContentBase: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      marginHorizontal: 10,
      marginTop: 15,
      borderRadius: 30,
      ...(isDarkMode
        ? {
            borderWidth: 0.2,
            borderColor: colors.white,
            backgroundColor: colors.bgPrimary,
          }
        : {
            backgroundColor: tabBarColors.tabContentBg,
            shadowOpacity: 0,
            elevation: 0,
          }),
    },
  });
};
