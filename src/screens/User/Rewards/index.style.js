import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const rewardsScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, rewardsScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flexGrow: 1,
      backgroundColor: themeColors.bgPrimary,
      paddingLeft: 18,
      paddingVertical: 25,
      width: screenWidth,
    },
    header: {
      paddingHorizontal: 27,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'space-between',
      flexDirection: 'row',
    },
    headerTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    headerTextPrimary: {
      color: rewardsScreenColors.headerFont,
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
      width:110,
      paddingVertical: 5,
      backgroundColor: rewardsScreenColors.redeemButton,
      color: 'white',
    },
    statusContainer: {
      marginVertical: 30,
    },
    statusTitle: {
      color: rewardsScreenColors.headerFont,
      opacity: 0.34,
      fontSize: 12,
      marginBottom: 4,
    },
    rewardsItemsWrapper: {
      width: '99%',
      marginBottom: 30,
    },
    rewardItemContainer: {
      backgroundColor: rewardsScreenColors.rewardItemBg,
      borderRadius:15,
      margin:10,
      flexDirection: 'row',
      alignItems: 'center',
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
      fontSize: 16,
      color: rewardsScreenColors.rewardItemTitle,
      fontWeight: '500',
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
      margin: 10,
      fontWeight: 500,
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryView: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'space-between',
      marginBottom: '20%',
      justifyContent: 'center'
    }
  });
};
