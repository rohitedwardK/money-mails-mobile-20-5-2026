import React, {createContext} from 'react';
import {Dimensions, Platform, useColorScheme} from 'react-native';

export const DeviceContext = createContext();

const DeviceContextProvider = ({children}) => {
  const isIos = Platform.OS === 'ios';
  const isAndroid = !isIos;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isDarkMode = false //useColorScheme() === 'dark';

  const value = {
    isIos,
    isAndroid,
    screenHeight,
    screenWidth,
    isDarkMode,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export default DeviceContextProvider;
