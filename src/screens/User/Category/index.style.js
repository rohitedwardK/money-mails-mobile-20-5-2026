import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const categoryPageStyles = () => {
  const {themeColors: colors, tabBarColors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      // flexDirection: 'row',
      // flexWrap: 'wrap',
      backgroundColor: colors.bgPrimary,
      paddingBottom : '15%'
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
