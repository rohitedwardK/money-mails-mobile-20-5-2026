import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

const sizeMapping = {
  small: {
    height: 15,
    font: 13,
  },
  medium: {
    height: 27,
    font: 13,
  },
  large: {
    height: 57,
    font: 16,
  },
};

export const buttonStyles = ({justifyIconSpace, fontStrong, size}) => {
  const {buttonColors: colors, themeColors} = getColors();
  const textStyles = {
    fontWeight: fontStrong ? '700' : 'normal',
    fontSize: sizeMapping[size]?.font,
    fontFamily: themeColors.fontFamily,
  };

  return StyleSheet.create({
    default: {
      width: '100%',
      display: 'flex',
      height: sizeMapping[size]?.height,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: justifyIconSpace || 'center',
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: 'transparent',
    },
    primary: {
      backgroundColor: colors.btnPrimary,
    },
    secondary: {
      backgroundColor: colors.btnSecondary,
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
