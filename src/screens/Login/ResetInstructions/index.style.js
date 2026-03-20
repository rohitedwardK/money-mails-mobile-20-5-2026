import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const styles = ({screenHeight, isIos}) => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      backgroundColor: colors.bgPrimary,
      height: '100%',
      paddingHorizontal: 25,
      paddingTop: screenHeight * (isIos ? 0.07 : 0.05),
      position: 'relative',
      width: '100%',
    },
    backButton: {
      width: 70,
      marginLeft: -15,
    },
    header: {
      marginTop: 70,
      marginBottom: 35,
      alignItems: 'center',
    },
    pageTitle: {
      color: colors.fontPrimary,
      fontSize: 21,
      fontWeight: '600',
    },
    subTitle: {
      fontSize: 10,
      color: '#707070',
      marginTop: 8,
      maxWidth: '80%',
      textAlign: 'center',
    },
    sendBtn: {
      height: 48,
      marginTop: 40,
    },
    sendBtnText: {
      fontSize: 13,
    },
    skipBtn: {
      marginTop: '15%',
      maxWidth: '75%',
      alignSelf: 'center',
      borderRadius: 50,
    },
    skipBtnText: {
      color: '#505050',
      fontSize: 12,
    },
  });
};
