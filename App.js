import React, {useContext} from 'react';
import {ActivityIndicator, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DeviceContextProvider from './src/context/DeviceContext';
import LoginScreens from './src/screens/Login';
import UserScreens from './src/screens/User';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ModalContextProvider from './src/context/ModalContext';
import UserContextProvider, {UserContext} from './src/context/UserContext';

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

const RootNavigator = () => {
  const {userDetails, isUserSessionLoading} = useContext(UserContext);
  const isAuthenticated = Boolean(userDetails?.token);

  if (isUserSessionLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#168F79" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isAuthenticated ? 'UserScreens' : 'LoginScreens'}>
        <Stack.Screen name="LoginScreens" component={LoginScreens} />
        <Stack.Screen name="UserScreens" component={UserScreens} />
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
