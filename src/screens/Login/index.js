import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import GetStarted from './GetStarted';
import SignIn from './SignIn';
import {StatusBar, View} from 'react-native';
import {DeviceContext} from '../../context/DeviceContext';
import getColors from '../../utils/colors';
import ResetPassword from './ResetPassword';
import ResetInstructions from './ResetInstructions';
import NewPassword from './NewPassword';
import SignUp from './SignUp';
import UserVerification from './UserVerification';
import PointRedeemHistory from '../User/PointRedeemHistory';
import Instruction from './Instructions';
import PendingVerification from './PendingVerification';
import SigupInfo from './SignupInfo';

const Stack = createNativeStackNavigator();

const LoginScreens = () => {
  const {themeColors: colors} = getColors();

  const {isDarkMode} = useContext(DeviceContext);
  return (
    <View style={{display: 'flex', flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        backgroundColor={colors.bgPrimary}
        barStyle={!isDarkMode ? 'dark-content' : 'light-content'}
        translucent
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true
        }}
        initialRouteName="GetStarted">
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ResetInstructions" component={ResetInstructions} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen
         options={{
          headerShown:true,
          headerBackTitleVisible: false,
          title: 'Sign Up'
        }}
         name="SignUp" component={SignUp} />
        <Stack.Screen 
        options={{
          headerShown:true,
          title: 'Sign Up Information'
        }}
        name="SignUpInfo" component={SigupInfo} />
        <Stack.Screen name="Verification" component={UserVerification} />
        <Stack.Screen name="Instruction" component={Instruction} />
        <Stack.Screen name="PendingVerification" component={PendingVerification} />
        <Stack.Screen name="PointRedeemHistory"  component={PointRedeemHistory} />
      </Stack.Navigator>
    </View>
  );
};

export default LoginScreens;
