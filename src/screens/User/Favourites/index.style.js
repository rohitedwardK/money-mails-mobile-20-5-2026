import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

const useFavouritesScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, rewardsScreenColors, isDarkMode} = getColors();
  const pageHorizontalPadding = 14;
  const brandCardGap = 12;
  const brandCardSize = (screenWidth - pageHorizontalPadding * 2 - brandCardGap) / 2;

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingBottom: 88,
      paddingHorizontal: 14,
      width: screenWidth,
    },
    searchBand: {
      width: screenWidth,
      marginHorizontal: -14,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: themeColors.highlightPrimary,
    },
    searchWrapper: {
      position: 'relative',
      width: '100%',
      height: 40,
      borderRadius: 20,
      backgroundColor: themeColors.surfacePrimary,
      borderWidth: 1,
      borderColor: themeColors.borderSubtle,
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
      color: themeColors.fontPrimary,
      paddingVertical: 8,
      borderRadius: 20,
      paddingRight: 16,
      paddingLeft: 40,
      fontSize: 13,
      fontWeight: '600',
    },
    favouriteTabStrip: {
      width: screenWidth,
      marginHorizontal: -14,
      backgroundColor: themeColors.homeBand || themeColors.surfacePrimary,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderSubtle,
      paddingHorizontal: 10,
    },
    favouriteTabBar: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favouriteTabButton: {
      minHeight: 40,
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginRight: 8,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    favouriteTabButtonActive: {
      borderBottomColor: themeColors.highlightPrimary,
    },
    favouriteTabText: {
      color: themeColors.fontMuted,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '700',
    },
    favouriteTabTextActive: {
      color: themeColors.highlightPrimary,
    },
    header: {
      paddingHorizontal: 18,
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: themeColors.surfacePrimary,
      borderRadius: 20,
      paddingVertical: 18,
    },
    headerTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    headerTextPrimary: {
      color: rewardsScreenColors?.headerFont,
      fontSize: 18,
      fontWeight: '900',
      marginVertical: 3,
    },
    headerTextSecondary: {
      color: rewardsScreenColors.headerFont,
      opacity: 0.55,
      fontSize: 11,
      fontWeight: '600',
    },
    redeedBtn: {
      borderRadius: 999,
      backgroundColor: rewardsScreenColors?.redeemButton,
    },
    statusContainer: {
      marginVertical: 24,
    },
    statusTitle: {
      color: rewardsScreenColors?.headerFont,
      opacity: 0.72,
      fontSize: 13,
      marginBottom: 4,
      fontWeight: '700',
    },
    rewardsItemsWrapper: {
      marginBottom: 30,
    },
    rewardItemContainer: {
      backgroundColor: rewardsScreenColors?.rewardItemBg,
      width: '100%',
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    rewardCategoryIcon: {
      borderWidth: 1,
      borderColor: isDarkMode
        ? themeColors?.white
        : rewardsScreenColors?.rewardIconSelectedBg,
      marginRight: 20,
    },
    rewardItemContainerSelected: {
      backgroundColor: rewardsScreenColors?.rewardItemSelectedBg,
      borderRightColor: rewardsScreenColors?.rewardItemSelectedBg,
      borderRightWidth: 1,
    },
    rewardItemTitle: {
      fontSize: 16,
      color: rewardsScreenColors?.rewardItemTitle,
      fontWeight: '500',
    },
    rewardItemSubTitle: {
      fontSize: 12,
      color: themeColors?.fontPrimary,
      fontWeight: '500',
    },
    rewardItemInfoText: {
      fontSize: 12,
      color: rewardsScreenColors?.rewardItemInfoText,
      fontWeight: '200',
    },
    brandGridWrapper: {
      marginBottom: 20,
    },
    brandListContent: {
      paddingTop: 4,
      paddingBottom: 24,
    },
    brandListRow: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: brandCardGap,
    },
    brandCardShell: {
      width: brandCardSize,
      height: brandCardSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandCard: {
      width: '100%',
      height: '100%',
    },
    mailList: {
      paddingTop: 16,
      paddingBottom: 24,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyTitle: {
      fontSize: 17,
      lineHeight: 24,
      fontWeight: '700',
      color: themeColors.fontPrimary,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: themeColors.fontMuted,
      textAlign: 'center',
      marginTop: 8,
    },
  });
};

export const rewardsScreenStyles = useFavouritesScreenStyles;
