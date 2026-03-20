import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import getColors from '../../../utils/colors';

export const styles = () => {
  const {themeColors: colors, tabBarColors} = getColors();
  const {screenWidth, screenHeight} = useContext(DeviceContext);

  return StyleSheet.create({
    dropdown: {
      height: 50,
      color:'black',
      width: screenWidth,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    placeholderStyle: {
      fontSize: 16,
      color:'black'
    },
    selectedTextStyle: {
      fontSize: 16,
      color:'black'
    },
    
    inputSearchStyle: {
      color:'black',
      width:"100%",
      height: 40,
      fontSize: 16,
    },
    pageContainer: {
      // marginTop: -600,
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    brandIconCardsWrapper: {
      width: screenWidth,
      marginVertical: 12,
      paddingVertical: 10,
      backgroundColor: '#EEF5E6',
      borderRadius: 10,
    },
    brandListContent: {
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    brandListItem: {
      marginHorizontal: 6,
      marginVertical: 4,
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
      justifyContent: 'space-between'
    },
    drawer: {
      backgroundColor: 'transparent',
    },
    drawerContent: {
      backgroundColor: 'transparent',
    },
    offerDetailsContainer: {
      position: 'absolute',
      width: screenWidth,
      height: screenHeight,
      top: 0,
      left: 0,
      alignItems: 'center',
      backgroundColor: colors.transparentDrawer,
      paddingTop: 40,
    },
    timerContainer: {
      flexDirection: 'row',
      marginBottom: 0,
    },
    hourGlassImg: {
      width: 60,
      height: 90,
      marginRight: 20,
    },
    secondsCounter: {
      color: colors.white,
      fontSize: 70,
      fontWeight: '400',
    },
    offerDetailsImage: {
      maxWidth: '80%',
      maxHeight: '50%',
    },
    dropdown: {
      height: 50,
      color:'black',
      width: screenWidth/2.15,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
      color:'black'
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
    placeholderStyle: {
      fontSize: 16,
      color:'black'
    },
    selectedTextStyle: {
      fontSize: 16,
      color:'black'
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
    illustrationView: {
      flex: 1,
      justifyContent: 'center',
    },
  });
};
