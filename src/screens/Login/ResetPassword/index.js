import React, {useContext} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../../../components/atoms/Button';
import {UserContext} from '../../../context/UserContext';
import {clearAuthSession} from '../../../utils/secureStorage';
import {usePasswordRecovery} from '../../../hooks/usePasswordRecovery';

const ResetPassword = ({navigation, route}) => {
  const flow = usePasswordRecovery(route?.params?.email || '');
  const {setUserDetails, setPostAuthScreen, setPendingGuestRoute} = useContext(UserContext);
  const login = async () => {
    try {
      await clearAuthSession();
      setUserDetails({});
      setPostAuthScreen(null);
      setPendingGuestRoute(null);
      navigation.replace('EmailOtp', {mode: 'login', email: flow.email, passwordLogin: true});
    } catch (_) {
      flow.setMessage('Your password was updated. Session cleanup failed; please try Login again.');
    }
  };
  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
        <Button btnText="Back" variant="secondary" disabled={flow.busy} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{flow.step === 'success' ? 'Password updated' : 'Recover your password'}</Text>
        <Text style={styles.copy}>
          {flow.step === 'email' ? 'Enter your registered email to request a recovery code.'
            : flow.step === 'code' ? 'Enter the 6-digit code from your email. It expires in 10 minutes.'
            : flow.step === 'password' ? 'Choose a new password with 8 to 72 characters.'
            : 'Your password has been changed. Log in with your new password.'}
        </Text>
        {!!flow.message && <Text accessibilityLiveRegion="polite" style={styles.message}>{flow.message}</Text>}
        {flow.step === 'email' && (
          <TextInput accessibilityLabel="Email address" style={styles.field} value={flow.email}
            onChangeText={flow.setEmail} editable={!flow.busy} autoCapitalize="none" autoCorrect={false}
            keyboardType="email-address" autoComplete="email" placeholder="Email address" placeholderTextColor="#64748B" />
        )}
        {flow.step === 'code' && (
          <TextInput accessibilityLabel="Recovery code" style={styles.field} value={flow.otp}
            onChangeText={value => flow.setOtp(value.replace(/[^0-9]/g, ''))} editable={!flow.busy}
            keyboardType="number-pad" maxLength={6} autoComplete="one-time-code"
            placeholder="6-digit code" placeholderTextColor="#64748B" />
        )}
        {flow.step === 'password' && (
          <View>
            <TextInput accessibilityLabel="New password" style={styles.field} value={flow.password}
              onChangeText={flow.setPassword} editable={!flow.busy} secureTextEntry autoCapitalize="none"
              autoCorrect={false} autoComplete="new-password" maxLength={72}
              placeholder="New password" placeholderTextColor="#64748B" />
            <TextInput accessibilityLabel="Confirm password" style={styles.field} value={flow.confirmPassword}
              onChangeText={flow.setConfirmPassword} editable={!flow.busy} secureTextEntry autoCapitalize="none"
              autoCorrect={false} maxLength={72} placeholder="Confirm password" placeholderTextColor="#64748B" />
          </View>
        )}
        {flow.step === 'success' ? <Button btnText="Login" variant="primary" onPress={login} /> : (
          <Button btnText={flow.busy ? 'Please wait...' : flow.step === 'email' ? 'Send code'
            : flow.step === 'code' ? 'Verify code' : 'Update password'} variant="primary"
            disabled={flow.busy || (flow.step === 'email' && flow.retryIn > 0)}
            onPress={flow.step === 'email' ? flow.requestCode : flow.step === 'code' ? flow.verifyCode : flow.updatePassword} />
        )}
        {flow.step === 'code' && (
          <Button btnText={flow.retryIn > 0 ? 'Resend in ' + flow.retryIn + 's' : 'Resend code'}
            variant="secondary" disabled={flow.busy || flow.retryIn > 0} onPress={flow.requestCode} />
        )}
        {['code', 'password'].includes(flow.step) && (
          <Button btnText="Start again" variant="secondary" disabled={flow.busy} onPress={flow.restart} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: '#FFFFFF'},
  page: {flexGrow: 1, justifyContent: 'center', padding: 24},
  title: {fontSize: 24, fontWeight: '700', color: '#17212B', marginVertical: 16},
  copy: {fontSize: 15, lineHeight: 22, color: '#475569', marginBottom: 20},
  field: {minHeight: 50, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8,
    paddingHorizontal: 12, color: '#17212B', marginBottom: 16},
  message: {fontSize: 14, color: '#475569', marginBottom: 16},
});
export default ResetPassword;
