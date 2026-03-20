import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';
 
export const myProfileScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, myProfileScreenColors, isDarkMode} = getColors();
 
  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: themeColors.bgPrimary,
      paddingHorizontal: 35,
      height: '100%',
      paddingTop: 70,
      width: '100%',
    },
    header: {
      fontSize: 22,
      color: themeColors.fontPrimary,
      fontWeight: '600',
    },
    readOnlyFormContainer: {
      width: '100%',
      backgroundColor: 'transparent',
      paddingBottom: 30,
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
      width: screenWidth - 70,
      backgroundColor: 'transparent',
      color : 'black'
    },
    detailsItemInfo: {
      color: myProfileScreenColors.fontColor,
      opacity: isDarkMode ? 0.5 : 1,
      flex: 1,
    },
  });
};