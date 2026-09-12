import React, {useContext} from 'react';
import {ActivityIndicator, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/api/queryClient';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DeviceContextProvider from './src/context/DeviceContext';
import LoginScreens from './src/screens/Login';
import UserScreens from './src/screens/User';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ModalContextProvider from './src/context/ModalContext';
import UserContextProvider, {UserContext} from './src/context/UserContext';
import {getPostAuthRoute} from './src/utils/authSession';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {userDetails, isUserSessionLoading, postAuthScreen, pendingGuestRoute} =
    useContext(UserContext);
  const authTarget = getPostAuthRoute(userDetails);
  const isAuthenticated =
    (Boolean(userDetails?.token) && authTarget.stack === 'UserScreens') ||
    Boolean(pendingGuestRoute);

  if (isUserSessionLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#20A64A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? (
          <Stack.Screen
            name="UserScreens"
            component={UserScreens}
            initialParams={
              pendingGuestRoute || (postAuthScreen ? {screen: postAuthScreen} : undefined)
            }
          />
        ) : (
          <Stack.Screen name="LoginScreens" component={LoginScreens} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView
      style={{
        display: 'flex',
        flex: 1,
      }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <DeviceContextProvider>
            <ModalContextProvider>
              <UserContextProvider>
                <RootNavigator />
              </UserContextProvider>
            </ModalContextProvider>
          </DeviceContextProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
