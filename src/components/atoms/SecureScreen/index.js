import React, {useEffect} from 'react';
import {NativeModules, Platform, View} from 'react-native';

const {SecureFlag} = NativeModules;

const SecureScreen = ({children, style}) => {
  useEffect(() => {
    if (Platform.OS !== 'android' || !SecureFlag?.setSecure) {
      return undefined;
    }

    SecureFlag.setSecure(true);
    return () => {
      SecureFlag.setSecure(false);
    };
  }, []);

  return <View style={[{flex: 1}, style]}>{children}</View>;
};

export default SecureScreen;
