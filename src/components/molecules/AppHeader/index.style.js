import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const appBarStyles = ({isAndroid}) => {
  const {themeColors: colors, isDarkMode} = getColors();
  const homeSectionBg = colors.homeBand;

  return StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      minHeight: 70,
      paddingTop: 8,
      paddingBottom: 6,
      paddingHorizontal: 14,
      backgroundColor: homeSectionBg,
      width: '100%',
      overflow: 'hidden',
    },
    headerBackgroundImage: {
      opacity: isDarkMode ? 0.22 : 0.45,
    },
    locationButton: {
      flex: 1,
      maxWidth: '62%',
      minHeight: 54,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingRight: 8,
      zIndex: 1,
    },
    logoContainer: {
      width: 126,
      height: 30,
      marginBottom: 2,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    locationTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationTitleText: {
      flexShrink: 1,
      color: colors.fontSecondary,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700',
      marginLeft: 2,
    },
    locationSubtitleText: {
      color: colors.fontSecondary,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '600',
      marginLeft: 18,
      marginTop: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginLeft: 'auto',
      minWidth: 116,
      zIndex: 1,
    },
    initialsButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFE2A3',
      borderWidth: 0,
    },
    initialsText: {
      color: '#5D3511',
      fontSize: 14,
      lineHeight: 17,
      fontWeight: '900',
    },
    notificationIcon: {
      marginLeft: 'auto',
    },

    bingoButton: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFE5E5',
      borderRadius: 17,
      borderWidth: 0,
      marginRight: 8,
    },
    notificationButton: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 17,
      backgroundColor: colors.homeCardMuted,
      marginRight: 8,
    },
  });
};
