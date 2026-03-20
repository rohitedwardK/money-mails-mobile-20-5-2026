import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const modalStyles = () => {
  const {themeColors: colors, isDarkMode} = getColors();

  return StyleSheet.create({
    modalContainer: {
      backgroundColor: colors.bgPrimary,
    },
  });
};
