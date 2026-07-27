import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const styles = () => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      backgroundColor: colors.bgPrimary,
      height: '100%',
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    carousalContainer: {
      paddingVertical: 42,
      marginVertical: 8,
      backgroundColor: colors.surfacePrimary,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      shadowOpacity: 0,
      elevation: 0,
    },
    illustrationView: {
      flex: 1,
      justifyContent: 'center',
    },
    getStartedBtn: {marginBottom: 22},
  });
};
