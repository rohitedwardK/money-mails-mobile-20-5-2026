import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const favPageStyles = screenWidth => {
  const {themeColors: colors} = getColors();
  const listHorizontalPadding = 16;
  const cardGap = 12;
  const storeCardWidth = (screenWidth - listHorizontalPadding * 2 - cardGap) / 2;

  return StyleSheet.create({
    pageContainer: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    searchBand: {
      width: '100%',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: '#2F8438',
      overflow: 'hidden',
    },
    searchDoodleLayer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(32, 166, 74, 0.12)',
    },
    searchDoodleIcon: {
      position: 'absolute',
      opacity: 0.13,
    },
    searchWrapper: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfacePrimary,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
      zIndex: 1,
      top: 8,
    },
    searchInput: {
      width: '100%',
      height: '100%',
      color: colors.fontPrimary,
      paddingVertical: 8,
      borderRadius: 20,
      paddingRight: 16,
      paddingLeft: 40,
      fontSize: 13,
      fontWeight: '600',
    },
    brandIconCardsWrapper: {
      paddingHorizontal: 10,
      marginVertical: 40,
    },
    viewMore: {
      width: 3,
      height: 3,
    },
    tabContent: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 30,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
    listWrapper: {
      flex: 1,
      width: '100%',
    },
    storeListContent: {
      paddingHorizontal: listHorizontalPadding,
      paddingTop: 12,
      paddingBottom: 24,
    },
    storeListRow: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: cardGap,
    },
    storeCardShell: {
      width: storeCardWidth,
      minHeight: 222,
    },
    storeCard: {
      width: '100%',
      height: 222,
    },
  });
};
