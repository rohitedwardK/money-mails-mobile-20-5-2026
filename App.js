import React, { useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceContextProvider from './src/context/DeviceContext';
import LoginScreens from './src/screens/Login';
import UserScreens from './src/screens/User';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ModalContextProvider from './src/context/ModalContext';
import UserContextProvider from './src/context/UserContext';
import {requestUserPermission, notificationListener} from './src/utils/notificationService';

const Stack = createNativeStackNavigator();



const App = () => {
  React.useEffect(()=>{
    requestUserPermission();
    notificationListener();
  },[])
  
  return (
    <GestureHandlerRootView
      style={{
        display: 'flex',
        flex: 1,
      }}>
      <DeviceContextProvider>
        <ModalContextProvider>
          <UserContextProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
              initialRouteName="LoginScreens">
              <Stack.Screen name="LoginScreens" component={LoginScreens} />
              <Stack.Screen name="UserScreens" component={UserScreens} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserContextProvider>
        </ModalContextProvider>
      </DeviceContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;

