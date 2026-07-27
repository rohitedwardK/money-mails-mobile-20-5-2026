import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { DeviceContext } from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const useCategoryPageStyles = () => {
  const { themeColors: colors } = getColors();
  const { screenWidth } = useContext(DeviceContext);
  const listHorizontalPadding = 16;
  const cardGap = 12;
  const cardWidth = (screenWidth - listHorizontalPadding * 2 - cardGap) / 2;

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingBottom: 104,
    },
    searchBand: {
      width: '100%',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: colors.highlightPrimary,
    },
    searchWrapper: {
      position: 'relative',
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
    listContent: {
      paddingHorizontal: listHorizontalPadding,
      paddingTop: 12,
      paddingBottom: 112,
    },
    listRow: {
      justifyContent: 'space-between',
      marginBottom: cardGap,
    },
    categoryCard: {
      width: cardWidth,
      borderRadius: 8,
      backgroundColor: colors.surfacePrimary,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      overflow: 'hidden',
      shadowOpacity: 0,
      elevation: 0,
    },
    categoryCardSelected: {
      borderColor: colors.highlightPrimary,
      borderWidth: 2,
    },
    cardImageWrap: {
      width: '100%',
      height: 96,
      backgroundColor: colors.surfaceSecondary,
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    cardImageFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
    },
    discountBadge: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      minHeight: 17,
      justifyContent: 'center',
      paddingHorizontal: 4,
      backgroundColor: 'rgba(20, 20, 20, 0.72)',
    },
    discountBadgeText: {
      color: colors.white,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '800',
    },
    cardBody: {
      paddingHorizontal: 8,
      paddingTop: 6,
      paddingBottom: 9,
    },
    ratingPill: {
      alignSelf: 'flex-start',
      minHeight: 16,
      borderRadius: 8,
      paddingHorizontal: 5,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.highlightPrimary,
      marginTop: -13,
      marginBottom: 4,
    },
    ratingText: {
      color: colors.white,
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '900',
      marginLeft: 2,
    },
    cardTitle: {
      color: colors.fontPrimary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '900',
      marginBottom: 4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      flex: 1,
      color: colors.highlightPrimary,
      fontSize: 10,
      lineHeight: 13,
      fontWeight: '700',
      marginLeft: 3,
    },
    emptyState: {
      minHeight: 220,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    emptyTitle: {
      color: colors.fontPrimary,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      marginBottom: 6,
    },
    emptyText: {
      color: colors.fontSecondary,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
};
