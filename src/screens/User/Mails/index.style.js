import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const categoryPageStyles = () => {
  const {themeColors: colors, tabBarColors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      backgroundColor: 'transparent',
      flex: 1,
      paddingBottom: 104,
    },
    brandIconCardsWrapper: {
      paddingHorizontal: 14,
      marginVertical: 24,
    },
    viewMore: {
      width: 3,
      height: 3,
    },
    tabContent: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 22,
      paddingBottom: 104,
      paddingHorizontal: 14,
      justifyContent: 'space-between',
    },
  });
};
