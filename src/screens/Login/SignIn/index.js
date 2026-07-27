import React, {useContext} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '../../../components/atoms/Button';
import BrandLogo from '../../../assets/images/brandLogo.js';
import GetStartedIllustration from '../../../assets/images/getStartedIllustration.js';
import GoogleIcon from '../../../assets/images/googleIcon.svg.js';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as signInScreenStyles} from './index.style';

const SignIn = ({navigation}) => {
  const {isIos, screenHeight} = useContext(DeviceContext);
  const styles = signInScreenStyles({screenHeight, isIos});

  return (
    <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.pageContainer}>
          <View style={styles.heroCard}>
            <View style={styles.logoContainer}>
              <BrandLogo width={300} height={62} />
            </View>
            <View style={styles.heroIllustrationContainer}>
              <GetStartedIllustration />
            </View>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.pageTitle}>Login to your Account</Text>
            <Text style={styles.helperText}>
              Continue with Google or sign in with your email using a one-time
              verification code.
            </Text>
            <Button
              btnText="Sign in with Google"
              variant="secondary"
              size="large"
              fontStrong
              justifyIconSpace="center"
              startIcon={
                <GoogleIcon style={styles.googleIcon} />
              }
              overridingStyles={styles.googleButton}
              btnTextOverrideStyles={styles.googleButtonText}
              onPress={() => navigation.navigate('GoogleAuth')}
            />
            <Button
              btnText="Continue with Email"
              variant="primary"
              size="large"
              overridingStyles={styles.actionButton}
              onPress={() => navigation.navigate('EmailOtp', {mode: 'login'})}
            />
            <Text style={styles.termsText}>
              By continuing, you agree to the Terms and Conditions and Privacy
              Policy.
            </Text>
            <Button
              btnText="Sign up"
              variant="secondary"
              type="link"
              linkpreText="Don't have an account?"
              overridingStyles={styles.linkButton}
              onPress={() => navigation.navigate('SignUp')}
            />
            <Button
              btnText="Forgot Password?"
              variant="secondary"
              type="text"
              overridingStyles={styles.forgotButton}
              btnTextOverrideStyles={styles.forgotText}
              onPress={() => navigation.navigate('ResetPassword')}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
