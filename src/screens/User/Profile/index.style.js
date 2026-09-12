import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

const useMyProfileScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, myProfileScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingHorizontal: 20,
      height: '100%',
      paddingTop: 28,
      width: '100%',
    },
    header: {
      fontSize: 26,
      color: themeColors.fontPrimary,
      fontWeight: '800',
      textAlign: 'center',
    },
    readOnlyFormContainer: {
      width: '100%',
      backgroundColor: themeColors.surfacePrimary,
      padding: 14,
      paddingBottom: 22,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: themeColors.borderSubtle,
      shadowOpacity: 0,
      elevation: 0,
    },
    detailsItem: {
      borderWidth: 1,
      width: screenWidth - 70,
      height: 45,
      alignItems: 'center',
      borderRadius: 4,
      paddingHorizontal: 8,
      borderColor: myProfileScreenColors.borderColor,
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    detailsItemNew: {
      width: screenWidth - 68,
      backgroundColor: themeColors.surfaceSecondary,
      color: themeColors.fontPrimary,
      borderRadius: 14,
      marginBottom: 2,
    },
    detailsItemInfo: {
      color: myProfileScreenColors.fontColor,
      opacity: isDarkMode ? 0.5 : 1,
      flex: 1,
    },
  });
};

export const myProfileScreenStyles = useMyProfileScreenStyles;
