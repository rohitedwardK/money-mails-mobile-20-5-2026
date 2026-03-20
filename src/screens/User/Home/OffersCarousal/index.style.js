import {StyleSheet} from 'react-native';
import getColors from '../../../../utils/colors';

export const styles = () => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    animatedView: {flex: 1},
    imageCardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.cardsPlaceholder,
      borderRadius: 8,
      overflow: 'hidden',
    },
    image: {
      height: 220,
      width: '100%',
    },
  });
};
