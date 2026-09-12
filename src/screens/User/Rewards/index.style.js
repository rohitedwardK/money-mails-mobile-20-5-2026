import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

const useRewardsScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, rewardsScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flexGrow: 1,
      backgroundColor: 'transparent',
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 104,
      width: screenWidth,
    },
    header: {
      paddingHorizontal: 0,
      width: screenWidth,
      marginLeft: -16,
      marginRight: -16,
      marginBottom: 10,
      backgroundColor: themeColors.surfacePrimary,
      borderRadius: 0,
      borderWidth: 0,
      paddingTop: 14,
      paddingBottom: 12,
      shadowOpacity: 0,
      elevation: 0,
    },
    headerSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
    },
    headerTextWrapper: {
      flex: 1,
      minWidth: 0,
      marginLeft: 12,
      marginRight: 10,
    },
    headerTextPrimary: {
      color: themeColors.fontPrimary,
      fontSize: 20,
      lineHeight: 25,
      fontWeight: '900',
      marginTop: 2,
    },
    headerTextSecondary: {
      color: themeColors.fontSecondary,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '700',
    },
    headerActions: {
      width: 86,
      gap: 8,
    },
    redeedBtn: {
      borderRadius: 999,
      width: 86,
      height: 32,
      paddingHorizontal: 8,
      paddingVertical: 0,
      backgroundColor: themeColors.highlightPrimary,
      color: 'white',
    },
    redeemBtnText: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '800',
      textAlign: 'center',
    },
    statusContainer: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: themeColors.borderSubtle,
      paddingHorizontal: 16,
    },
    progressTrack: {
      width: '100%',
      paddingRight: 2,
    },
    statusTitle: {
      color: themeColors.fontPrimary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 10,
      fontWeight: '800',
    },
    rewardsItemsWrapper: {
      width: '99%',
      marginBottom: 30,
    },
    rewardItemContainer: {
      backgroundColor: rewardsScreenColors.rewardItemBg,
      borderRadius:18,
      margin:10,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: themeColors.borderSubtle,
    },
    rewardCategoryIcon: {
      borderWidth: 1,
      borderColor: isDarkMode
        ? themeColors.white
        : rewardsScreenColors.rewardIconSelectedBg,
      marginRight: 20,
    },
    rewardItemContainerSelected: {
      backgroundColor: rewardsScreenColors.rewardItemSelectedBg,
      borderRightColor: rewardsScreenColors.rewardItemSelectedBg,
      borderRightWidth: 1,
    },
    rewardItemTitle: {
      fontSize: 14,
      lineHeight: 18,
      color: themeColors.fontPrimary,
      fontWeight: '800',
    },
    rewardItemSubTitle: {
      fontSize: 12,
      color: themeColors.fontPrimary,
      fontWeight: '500',
    },
    rewardItemInfoText: {
      fontSize: 12,
      color: rewardsScreenColors.rewardItemInfoText,
      fontWeight: '200',
    },
    catTitle: {
      marginVertical: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryView: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'space-between',
      marginBottom: 20,
      justifyContent: 'center',
    },
    tabContentBase: {
      paddingTop: 12,
      paddingHorizontal: 8,
      paddingBottom: 22,
      minHeight: 360,
      width: screenWidth,
    },
    rewardTabContent: {
      width: '100%',
      alignItems: 'center',
    },
    rewardsTabsWrapper: {
      width: screenWidth,
      marginLeft: -16,
      marginRight: -16,
    },
    rewardsTabHeader: {
      width: screenWidth,
    },
    activeCategoryTitle: {
      color: themeColors.fontSecondary,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 12,
    },
    rewardGridRow: {
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: 12,
    },
    emptyRewardState: {
      minHeight: 220,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    emptyRewardTitle: {
      color: themeColors.fontPrimary,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      marginBottom: 6,
    },
    emptyRewardText: {
      color: themeColors.fontSecondary,
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
      fontWeight: '600',
    },
    categoryRailContent: {
      paddingBottom: 12,
      paddingRight: 16,
    },
    categoryRail: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.surfacePrimary,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: themeColors.borderSubtle,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    categoryChip: {
      minHeight: 38,
      maxWidth: 150,
      justifyContent: 'center',
      paddingHorizontal: 14,
      marginRight: 6,
      borderRadius: 999,
      backgroundColor: themeColors.surfaceSecondary,
    },
    categoryChipSelected: {
      backgroundColor: themeColors.highlightPrimary,
    },
    categoryChipText: {
      color: themeColors.fontSecondary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '800',
    },
    categoryChipTextSelected: {
      color: themeColors.white,
    },
  });
};

export const rewardsScreenStyles = useRewardsScreenStyles;
