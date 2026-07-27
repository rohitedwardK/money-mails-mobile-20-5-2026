import React from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '../../../components/atoms/Button';

const SignUp = ({navigation}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.wrapper}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.page}>
        <Image
          source={require('../../../assets/images/brand.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sign up for an Account</Text>
        <Text style={styles.copy}>
          Continue with Google or verify your email to create a new Money Mails
          account.
        </Text>
        <Button
          btnText="Google"
          variant="secondary"
          size="large"
          overridingStyles={styles.button}
          onPress={() => navigation.navigate('GoogleAuth')}
        />
        <Button
          btnText="Continue with Email"
          variant="primary"
          size="large"
          overridingStyles={styles.button}
          onPress={() => navigation.navigate('EmailOtp', {mode: 'signup'})}
        />
        <Text style={styles.terms}>
          By continuing, you agree to the Terms and Conditions and have read the
          Privacy Statement.
        </Text>
        <Button
          btnText="Login"
          variant="secondary"
          type="link"
          linkpreText="Already have an account?"
          overridingStyles={styles.link}
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    alignSelf: 'center',
    height: 96,
    marginBottom: 28,
    width: 180,
  },
  title: {
    color: '#17212B',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  copy: {
    color: '#5E6C7A',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
    width: '100%',
  },
  terms: {
    color: '#697586',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default SignUp;
