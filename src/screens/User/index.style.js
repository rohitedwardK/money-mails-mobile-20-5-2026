import {StyleSheet} from 'react-native';
import getColors from '../../utils/colors';

export const styles = () => {
  const {themeColors: colors, tabBarColors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      backgroundColor: colors.bgPrimary,
    },
    btnText: {

    }
  });
};
