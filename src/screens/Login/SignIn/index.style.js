import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const styles = ({screenHeight, isIos}) => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      backgroundColor: colors.bgPrimary,
      height: '100%',
      paddingHorizontal: 35,
      paddingTop: screenHeight * (isIos ? 0.1 : 0.05),
      position: 'relative',
    },
    formContainer: {paddingTop: screenHeight * 0.05},
    fieldsWrapper: {paddingTop: screenHeight * 0.05},
    loginBtn: {marginTop: '1%'},
    pageTitle: {
      color: colors.fontPrimary,
      fontSize: 21,
      fontWeight: '600',
      fontFamily: colors.fontFamily,
    },
    signUpBtn: {
      marginTop: 10,
      width: '100%',
      paddingHorizontal: 35,
      paddingVertical: 5,
      marginBottom: isIos ? 25 : 5
    },
  });
};
