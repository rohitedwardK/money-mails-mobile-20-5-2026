import {useEffect, useRef, useState} from 'react';
import {requestRecoveryCode, verifyRecoveryCode, completePasswordRecovery} from '../api/passwordRecovery';

export const usePasswordRecovery = (initialEmail = '') => {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [retryIn, setRetryIn] = useState(0);
  const retryAt = useRef(0);
  const resetToken = useRef('');
  const inFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => {
      setRetryIn(Math.max(0, Math.ceil((retryAt.current - Date.now()) / 1000)));
    }, 1000);
    return () => {
      mounted.current = false;
      resetToken.current = '';
      clearInterval(timer);
    };
  }, []);
  const run = async action => {
    if (inFlight.current) {return;}
    inFlight.current = true;
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      if (mounted.current) {setMessage(error?.message || 'Request failed. Please try again.');}
    } finally {
      inFlight.current = false;
      if (mounted.current) {setBusy(false);}
    }
  };
  const requestCode = () => run(async () => {
    if (retryAt.current > Date.now()) {return;}
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error('Enter a valid email address.');
    }
    const result = await requestRecoveryCode(normalized);
    if (!mounted.current) {return;}
    setEmail(normalized);
    resetToken.current = '';
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    retryAt.current = Date.now() + 60000;
    setRetryIn(60);
    setStep('code');
    setMessage(result.message || 'If this email is registered, we have sent a recovery code.');
  });
  const verifyCode = () => run(async () => {
    if (!/^\d{6}$/.test(otp)) {throw new Error('Enter the 6-digit code.');}
    const result = await verifyRecoveryCode(email, otp);
    if (!mounted.current) {return;}
    if (!result.resetToken) {throw new Error('Verification failed. Request a new code.');}
    resetToken.current = result.resetToken;
    setOtp('');
    setStep('password');
  });
  const updatePassword = () => run(async () => {
    if (password.length < 8 || password.length > 72) {
      throw new Error('Use a password with 8 to 72 characters.');
    }
    if (password !== confirmPassword) {throw new Error('Passwords must match.');}
    if (!resetToken.current) {throw new Error('Verify your email code first.');}
    try {
      await completePasswordRecovery(resetToken.current, password);
    } catch (error) {
      if (mounted.current && error.status === 400) {
        resetToken.current = '';
        setStep('code');
        setPassword('');
        setConfirmPassword('');
      }
      throw error;
    }
    if (!mounted.current) {return;}
    resetToken.current = '';
    setPassword('');
    setConfirmPassword('');
    setStep('success');
  });
  const restart = () => {
    if (inFlight.current) {return;}
    resetToken.current = '';
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    setStep('email');
  };
  return {email, setEmail, otp, setOtp, password, setPassword, confirmPassword,
    setConfirmPassword, step, message, setMessage, busy, retryIn, requestCode,
    verifyCode, updatePassword, restart};
};
