import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const favPageStyles = () => {
  const {themeColors: colors, tabBarColors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      backgroundColor: colors.bgPrimary,
      paddingBottom : '32%'
    },
    brandIconCardsWrapper: {
      paddingHorizontal: 10,
      marginVertical: 40,
    },
    viewMore: {
      width: 3,
      height: 3,
    },
    tabContent: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 30,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
  });
};
