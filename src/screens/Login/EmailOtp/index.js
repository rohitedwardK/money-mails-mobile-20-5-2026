import React, {useContext, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Button from '../../../components/atoms/Button';
import {UserContext} from '../../../context/UserContext';
import {
  loginWithPassword,
  sendEmailOtp,
  verifyEmailOtp,
} from '../../../api/moneyMails';
import {
  extractAuthData,
  fetchAuthenticatedUserProfile,
  getPostAuthRoute,
  persistUserSession,
} from '../../../utils/authSession';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const OTP_LENGTH = 6;
const EXISTING_EMAIL_MESSAGE_REGEX =
  /(already exists|already registered|already in use|account exists|user exists|email exists)/i;

const hasExistingEmail = result =>
  Boolean(
    result?.data?.email_exists ??
      result?.data?.emailExists ??
      result?.data?.is_existing_user ??
      result?.data?.isExistingUser ??
      result?.data?.existing_user ??
      result?.data?.existingUser ??
      result?.data?.user_exists ??
      result?.data?.userExists,
  );

const styles = {
  page: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#17212B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5E6C7A',
    marginBottom: 24,
  },
  field: {
    height: 48,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#17212B',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 44,
    height: 48,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#17212B',
  },
  link: {
    color: '#168F79',
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  status: {
    color: '#168F79',
    fontSize: 13,
    marginBottom: 16,
  },
};

const EmailOtp = ({navigation, route}) => {
  const mode = route?.params?.mode === 'signup' ? 'signup' : 'login';
  const {setUserDetails, setPostAuthScreen, setPendingGuestRoute} = useContext(UserContext);
  const otpRefs = useRef([]);
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(mode === 'login' && route?.params?.passwordLogin ? 'password' : 'entry');
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === 'signup' ? 'Create your Account' : 'Login with Email'),
    [mode],
  );

  const navigateAfterAuth = sessionData => {
    const target = getPostAuthRoute(sessionData);
    if (target.stack === 'UserScreens') {
      setPostAuthScreen(target.screen || 'Home');
      return;
    }
    navigation.navigate(target.screen || 'SignIn');
  };

  const showError = message => {
    Snackbar.show({
      text: message || 'Request could not be completed.',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      showError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await sendEmailOtp(normalizedEmail);
      setEmail(normalizedEmail);

      if (mode === 'login' && hasExistingEmail(result)) {
        setPassword('');
        setStatus('Enter your password to continue.');
        setStep('password');
        return;
      }

      setOtpValues(Array(OTP_LENGTH).fill(''));
      setStatus(result?.message || `Verification code sent to ${normalizedEmail}.`);
      setStep('verify');
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (error) {
      if (
        mode === 'login' &&
        EXISTING_EMAIL_MESSAGE_REGEX.test(error?.message || '')
      ) {
        setEmail(normalizedEmail);
        setPassword('');
        setStatus('Enter your password to continue.');
        setStep('password');
        return;
      }

      showError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!password.trim()) {
      showError('Enter your password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginWithPassword(normalizedEmail, password);
      const authData = extractAuthData(result);

      if (!authData?.token) {
        showError('Login could not be completed.');
        return;
      }

      const profile = await fetchAuthenticatedUserProfile(authData);
      const userData = await persistUserSession(profile, setUserDetails);
      navigateAfterAuth(userData);
    } catch (error) {
      showError(error?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== OTP_LENGTH) {
      showError('Enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmailOtp(email.trim().toLowerCase(), otp);
      const authData = extractAuthData(result);
      const emailVerificationToken = result?.data?.email_verification_token || '';

      if (authData?.token) {
        const profile = await fetchAuthenticatedUserProfile(authData);
        const userData = await persistUserSession(profile, setUserDetails);
        navigateAfterAuth(userData);
        return;
      }

      if (mode === 'signup' && emailVerificationToken) {
        setPendingGuestRoute({
          screen: 'CompleteInfo',
          params: {
            prefillEmail: email.trim().toLowerCase(),
            emailVerificationToken,
          },
        });
        return;
      }

      showError('Email verification could not be completed.');
    } catch (error) {
      showError(error?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const nextValue = String(value || '').replace(/\D/g, '').slice(-1);
    setOtpValues(current => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.page}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {step === 'entry'
              ? 'Enter your email address to receive a one-time verification code.'
              : step === 'password'
                ? `Enter the password for ${email}.`
              : `Enter the verification code sent to ${email}.`}
          </Text>

          {step === 'entry' ? (
            <>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor="#94A3B8"
                style={styles.field}
                value={email}
              />
              <Button
                btnText={loading ? 'Sending...' : 'Continue'}
                disabled={loading}
                onPress={handleSendOtp}
                size="large"
                variant="primary"
              />
            </>
          ) : step === 'password' ? (
            <>
              {!!status && <Text style={styles.status}>{status}</Text>}
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.field}
                value={password}
              />
              <Button
                btnText={loading ? 'Signing in...' : 'Login'}
                disabled={loading}
                onPress={handlePasswordLogin}
                size="large"
                variant="primary"
              />
              <TouchableOpacity
                disabled={loading}
                onPress={() =>
                  navigation.navigate('ResetPassword', {
                    email: email.trim().toLowerCase(),
                  })
                }>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  setPassword('');
                  setStatus('');
                  setStep('entry');
                }}>
                <Text style={styles.link}>Use another email</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!!status && <Text style={styles.status}>{status}</Text>}
              <View style={styles.otpRow}>
                {otpValues.map((value, index) => (
                  <TextInput
                    key={index}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={next => handleOtpChange(next, index)}
                    ref={ref => {
                      otpRefs.current[index] = ref;
                    }}
                    style={styles.otpBox}
                    value={value}
                  />
                ))}
              </View>
              <Button
                btnText={loading ? 'Verifying...' : 'Verify'}
                disabled={loading}
                onPress={handleVerifyOtp}
                size="large"
                variant="primary"
              />
              <TouchableOpacity disabled={loading} onPress={handleSendOtp}>
                <Text style={styles.link}>Resend code</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EmailOtp;
