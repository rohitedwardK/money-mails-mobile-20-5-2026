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
            shadowColor: tabBarColors.shadowColor,
            shadowOffset: {width: -2, height: 10},
            shadowOpacity: 1,
            shadowRadius: 3,
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
            shadowColor: tabBarColors.shadowColor,
            backgroundColor: tabBarColors.tabContentBg,
            shadowOffset: {width: -8, height: 10},
            shadowOpacity: 1,
            shadowRadius: 3,
          }),
    },
  });
};
