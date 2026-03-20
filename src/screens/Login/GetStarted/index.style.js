import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const styles = () => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      backgroundColor: colors.bgPrimary,
      height: '100%',
      paddingHorizontal: 35,
      justifyContent: 'center',
    },
    carousalContainer: {paddingVertical: 50},
    illustrationView: {
      flex: 1,
      justifyContent: 'center',
    },
    getStartedBtn: {marginBottom: 30},
  });
};
