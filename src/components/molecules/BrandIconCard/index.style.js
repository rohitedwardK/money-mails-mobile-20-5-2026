import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const brandIconCardStyles = ({
  rounded,
  size,
  color,
  maxSize,
  isSelected,
}) => {
  const {themeColors: colors, brandCardColors, isDarkMode} = getColors();

  const defaultSize = rounded ? 44 : 94;
  const cardSize = size || defaultSize;
  const maxDimensions = maxSize || cardSize;
  return StyleSheet.create({
    selectionWrapper: {
      ...(isSelected
        ? {
            backgroundColor: brandCardColors.selection,
          }
        : {}),
      width: cardSize,
      height: cardSize,
      borderRadius: rounded ? 500 : 12,
      maxWidth: maxDimensions,
      maxHeight: maxDimensions,
    },
    cardWrapper: {
      width: '100%',
      height: '100%',
      borderRadius: rounded ? 500 : 9,
      paddingHorizontal: rounded ? 0 : 19,
      paddingVertical: rounded ? 0 : 32,
      backgroundColor: color || themecolors?.bgPrimary,
      borderWidth: color ? 0 : 1,
      transform: [{scale: isSelected ? 0.9 : 1}],
    },
    imageView: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    favIcon: {position: 'absolute', top: rounded ? 14 : -20, right: rounded ? 14 : -5},
    actionWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '30%',
    },
    actionBtn: {
      fontSize: 4,
      paddingHorizontal: 0,
      borderRadius: 0,
      height: '100%',
      backgroundColor: brandCardColors.actionBtnBg,
      borderBottomLeftRadius: 9,
      borderBottomRightRadius: 9,
    },
    actionBtnIcon: {
      marginRight: 5
    },
  });
};
