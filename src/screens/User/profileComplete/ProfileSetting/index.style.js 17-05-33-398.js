import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const myProfileScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, myProfileScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        padding:10,
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
      color : '#454545',
    },

  });
};
