import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

const sizeMapping = {
  small: {
    height: 32,
    font: 12,
  },
  medium: {
    height: 42,
    font: 14,
  },
  large: {
    height: 54,
    font: 16,
  },
};

export const buttonStyles = ({justifyIconSpace, fontStrong, size}) => {
  const {buttonColors: colors, themeColors} = getColors();
  const textStyles = {
    fontWeight: fontStrong ? '700' : '600',
    fontSize: sizeMapping[size]?.font,
    letterSpacing: 0,
  };

  return StyleSheet.create({
    default: {
      width: '100%',
      display: 'flex',
      height: sizeMapping[size]?.height,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: justifyIconSpace || 'center',
      paddingHorizontal: 16,
      borderRadius: 14,
      backgroundColor: 'transparent',
    },
    primary: {
      backgroundColor: colors.btnPrimary,
      shadowOpacity: 0,
      elevation: 0,
    },
    secondary: {
      backgroundColor: colors.btnSecondary,
      borderWidth: 1,
      borderColor: themeColors.borderSubtle,
    },
    textPrimary: {
      color: colors.btnFontPrimary,
      ...textStyles,
    },
    textSecondary: {
      color: colors.btnFontSecondary,
      ...textStyles,
    },
    linkPrimary: {
      color: colors.btnFontLinkPrimary,
      ...textStyles,
    },
    linkSecondary: {
      color: colors.btnFontLinkSecondary,
      ...textStyles,
    },
    linkPretextPrimary: {
      color: colors.btnFontLinkPretextPrimary,
      ...textStyles,
    },
    linkPretextSecondary: {
      color: colors.btnFontLinkPretextSecondary,
      ...textStyles,
    },
  });
};
