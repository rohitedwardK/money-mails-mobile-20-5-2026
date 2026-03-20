import React, {useContext} from 'react';
import {View} from 'react-native';
import {StatusBar as StatusBarNative} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';
import {StatusBarStyle} from './index.style';

const StatusBar = ({color}) => {
  const {isIos, isDarkMode} = useContext(DeviceContext);
  return isIos ? (
    <View style={[StatusBarStyle, {backgroundColor: color}]}>
      <StatusBarNative
        translucent
        barStyle={!isDarkMode ? 'dark-content' : 'light-content'}
      />
    </View>
  ) : (
    <StatusBarNative
      backgroundColor={color}
      barStyle={!isDarkMode ? 'dark-content' : 'light-content'}
      translucent
    />
  );
};

export default StatusBar;
