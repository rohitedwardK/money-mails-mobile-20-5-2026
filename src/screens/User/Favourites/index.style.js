import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const rewardsScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, rewardsScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: themeColors?.bgPrimary,
      paddingVertical: 25,
      paddingHorizontal: 5,
      width: screenWidth,
    },
    header: {
      paddingHorizontal: 27,
      width: screenWidth,
      justifyContent: 'center',
      alignItems: 'space-between',
      flexDirection: 'row',
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
      opacity: 0.34,
      fontSize: 10,
    },
    redeedBtn: {
      borderRadius: 50,
      backgroundColor: rewardsScreenColors?.redeemButton,
    },
    statusContainer: {
      marginVertical: 30,
    },
    statusTitle: {
      color: rewardsScreenColors?.headerFont,
      opacity: 0.34,
      fontSize: 12,
      marginBottom: 4,
    },
    rewardsItemsWrapper: {
      marginBottom: 30,
    },
    rewardItemContainer: {
      backgroundColor: rewardsScreenColors?.rewardItemBg,
      width: '100%',
      borderTopLeftRadius: 500,
      borderBottomLeftRadius: 500,
      flexDirection: 'row',
      alignItems: 'center',
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
  });
};
