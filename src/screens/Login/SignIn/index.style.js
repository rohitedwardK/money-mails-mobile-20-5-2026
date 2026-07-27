import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const styles = ({screenHeight, isIos}) => {
  const {themeColors: colors} = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      flex: 1,
      backgroundColor: '#FFFFFF',
      minHeight: '100%',
      paddingHorizontal: 0,
      paddingTop: screenHeight * (isIos ? 0.08 : 0.06),
      paddingBottom: 0,
      position: 'relative',
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    heroCard: {
      alignItems: 'center',
      position: 'absolute',
      top: screenHeight * 0.055,
      left: 0,
      right: 0,
      bottom: screenHeight * 0.39,
      borderRadius: 0,
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      borderColor: 'rgba(255, 255, 255, 0.7)',
      overflow: 'hidden',
      zIndex: 1,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 28,
      zIndex: 2,
    },
    heroIllustrationContainer: {
      position: 'absolute',
      top: 88,
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 84,
      opacity: 0.88,
      zIndex: 1,
    },
    formContainer: {
      backgroundColor: '#F7FAF8',
      borderRadius: 0,
      paddingHorizontal: 24,
      paddingVertical: 26,
      borderWidth: 0,
      shadowColor: '#082A10',
      shadowOffset: {width: 0, height: 18},
      shadowOpacity: 0,
      shadowRadius: 34,
      elevation: 0,
      alignItems: 'center',
      zIndex: 1,
      width: '100%',
    },
    fieldsWrapper: {paddingTop: screenHeight * 0.05},
    loginBtn: {marginTop: '1%'},
    pageTitle: {
      color: colors.fontPrimary,
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0,
      textAlign: 'center',
    },
    helperText: {
      color: '#425466',
      fontSize: 14,
      lineHeight: 21,
      marginTop: 10,
      marginBottom: 22,
      textAlign: 'center',
    },
    actionButton: {
      marginBottom: 12,
      width: '100%',
    },
    googleButton: {
      marginBottom: 12,
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(21, 128, 61, 0.18)',
      borderRadius: 14,
      shadowOpacity: 0,
      elevation: 0,
    },
    googleButtonText: {
      color: '#1F2933',
      fontWeight: '700',
    },
    googleIcon: {
      marginRight: 10,
    },
    termsText: {
      color: '#5D6B7A',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
      textAlign: 'center',
    },
    linkButton: {
      justifyContent: 'center',
      marginTop: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      borderColor: 'rgba(255, 255, 255, 0.24)',
    },
    forgotButton: {
      justifyContent: 'center',
      marginTop: 10,
    },
    forgotText: {
      color: colors.fontMuted,
      fontSize: 13,
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
