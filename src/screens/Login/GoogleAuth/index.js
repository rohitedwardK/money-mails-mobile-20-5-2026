/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, View} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {
  GoogleSignin,
  isCancelledResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {UserContext} from '../../../context/UserContext';
import {registerGoogle} from '../../../api/moneyMails';
import {
  fetchAuthenticatedUserProfile,
  getPostAuthRoute,
  persistUserSession,
} from '../../../utils/authSession';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '../../../config';

const GoogleAuth = ({navigation}) => {
  const {setUserDetails, setPostAuthScreen} = useContext(UserContext);

  const navigateAfterAuth = sessionData => {
    const target = getPostAuthRoute(sessionData);
    if (target.stack === 'UserScreens') {
      setPostAuthScreen(target.screen || 'Home');
      return;
    }
    navigation.navigate(target.screen || 'SignIn');
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (!GOOGLE_WEB_CLIENT_ID) {
          throw new Error(
            'Google sign in is not configured for this environment.',
          );
        }

        GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
          offlineAccess: false,
        });

        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });
        }

        const result = await GoogleSignin.signIn();
        if (isCancelledResponse(result)) {
          navigation.goBack();
          return;
        }

        const googleData = result?.data || result;
        const googleUser = googleData?.user || {};
        const tokens = await GoogleSignin.getTokens();
        const idToken = tokens?.idToken || googleData?.idToken || '';

        if (!googleUser?.email || !idToken) {
          throw new Error('Google sign in could not be verified.');
        }

        const profile = {
          email: googleUser.email || '',
          firstName: googleUser.givenName || '',
          lastName: googleUser.familyName || '',
          given_name: googleUser.givenName || '',
          family_name: googleUser.familyName || '',
          avatar: googleUser.photo || '',
          profile_pic: googleUser.photo || '',
          googleSub: googleUser.id || '',
          provider: 'google',
          idToken,
        };

        const response = await registerGoogle(profile);
        const authData = response?.data
          ? {...response.data, token: response?.token || response.data?.token}
          : response;
        const sessionData = await fetchAuthenticatedUserProfile(authData);
        const userData = await persistUserSession(sessionData, setUserDetails);
        navigateAfterAuth(userData);
      } catch (error) {
        if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
          navigation.goBack();
          return;
        }

        Snackbar.show({
          text: error?.message || 'Google sign in failed. Please try again.',
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.goBack();
      }
    };

    run();
  }, [navigation, setUserDetails]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#168F79" />
      <Text style={styles.loadingText}>
        Opening Google sign in...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#17212B',
    fontSize: 16,
  },
});

export default GoogleAuth;
