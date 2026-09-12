import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const useSignupScreenStyles = () => {
  const {screenWidth} = useContext(DeviceContext);
  const {themeColors, myProfileScreenColors, isDarkMode} = getColors();

  return StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: themeColors?.bgPrimary,
      paddingHorizontal: 35,
      height: '100%',
      // paddingTop: 70,
      width: '100%',
    },
    header: {
      marginTop: 10,
      fontSize: 16,
      color: themeColors.fontPrimary,
      fontWeight: '700',
    },
    readOnlyFormContainer: {
      width: '100%',
      backgroundColor: 'transparent',
      paddingBottom: 30,
    },
    detailsItem: {
      width: screenWidth - 70,
      backgroundColor: 'transparent',
      flex: 1,
    },
    detailsItemCalender :{
      width: screenWidth - 70,
      backgroundColor: 'transparent',
      flex: 1,
    },
    detailsItemInfo: {
      color: myProfileScreenColors.fontColor,
      opacity: isDarkMode ? 0.5 : 1,
      flex: 1,
    },
    signUpBtn: {
      marginTop: -50,
      width: screenWidth - 70,
      marginBottom: 140,
      height: 50,
    },
    signUpBtnText: {
      fontSize: 14,
    },
    container: {
     marginTop:10,
     color:'black',
    },
    dropdown: {
      height: 50,
      color:'black',
      width: screenWidth - 70,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
      color:'black',
    },
    label: {
      // position: 'absolute',
      // backgroundColor: 'white',
      // left: 22,
      // top: 8,
      // zIndex: 999,
      // paddingHorizontal: 8,
      // fontSize: 14,
    },

    backButton: {
      width: 70,
      backgroundColor:'white',
      // marginLeft: -15,
    },
    placeholderStyle: {
      fontSize: 16,
      color:'black',
    },
    selectedTextStyle: {
      fontSize: 16,
      color:'black',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      color:'black',
      height: 40,
      fontSize: 16,
    },
  });
};
