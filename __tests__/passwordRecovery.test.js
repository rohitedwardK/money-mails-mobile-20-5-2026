import React from 'react';
import {act, create} from 'react-test-renderer';
import {usePasswordRecovery} from '../src/hooks/usePasswordRecovery';
import {requestRecoveryCode, verifyRecoveryCode, completePasswordRecovery} from '../src/api/passwordRecovery';
jest.mock('../src/api/passwordRecovery', () => ({
  requestRecoveryCode: jest.fn(),
  verifyRecoveryCode: jest.fn(),
  completePasswordRecovery: jest.fn(),
}));
jest.setTimeout(30000);
let flow;
let renderer;
const Probe = () => {
  flow = usePasswordRecovery(' Person@Example.com ');
  return null;
};
beforeEach(async () => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  requestRecoveryCode.mockResolvedValue({message: 'If registered, check your email.'});
  verifyRecoveryCode.mockResolvedValue({resetToken: 'reset-proof'});
  completePasswordRecovery.mockResolvedValue({});
  await act(async () => { renderer = create(<Probe />); });
});
afterEach(async () => {
  await act(async () => { renderer.unmount(); });
  jest.useRealTimers();
});
const reachPassword = async () => {
  await act(async () => { await flow.requestCode(); });
  await act(async () => { flow.setOtp('123456'); });
  await act(async () => { await flow.verifyCode(); });
};
test('recovery verifies email before updating password and clears sensitive fields', async () => {
  await reachPassword();
  expect(requestRecoveryCode).toHaveBeenCalledWith('person@example.com');
  expect(verifyRecoveryCode).toHaveBeenCalledWith('person@example.com', '123456');
  expect(flow.step).toBe('password');
  expect(flow.otp).toBe('');
  await act(async () => { flow.setPassword('New-password-123'); flow.setConfirmPassword('New-password-123'); });
  await act(async () => { await flow.updatePassword(); });
  expect(completePasswordRecovery).toHaveBeenCalledWith('reset-proof', 'New-password-123');
  expect(flow.step).toBe('success');
  expect(flow.password).toBe('');
  expect(flow.confirmPassword).toBe('');
});
test('mismatched passwords cannot call the reset API', async () => {
  await reachPassword();
  await act(async () => { flow.setPassword('New-password-123'); flow.setConfirmPassword('Different-123'); });
  await act(async () => { await flow.updatePassword(); });
  expect(completePasswordRecovery).not.toHaveBeenCalled();
  expect(flow.message).toBe('Passwords must match.');
});
test('cooldown and concurrent clicks do not send duplicate emails', async () => {
  let finish;
  requestRecoveryCode.mockReturnValueOnce(new Promise(resolve => { finish = resolve; }));
  let pending;
  await act(async () => { pending = flow.requestCode(); await flow.requestCode(); });
  expect(requestRecoveryCode).toHaveBeenCalledTimes(1);
  await act(async () => { finish({}); await pending; });
  await act(async () => { await flow.requestCode(); });
  expect(requestRecoveryCode).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(60000); });
  await act(async () => { await flow.requestCode(); });
  expect(requestRecoveryCode).toHaveBeenCalledTimes(2);
});
test('expired reset proof requires verification again and clears passwords', async () => {
  await reachPassword();
  completePasswordRecovery.mockRejectedValueOnce(Object.assign(new Error('Expired'), {status: 400}));
  await act(async () => { flow.setPassword('New-password-123'); flow.setConfirmPassword('New-password-123'); });
  await act(async () => { await flow.updatePassword(); });
  expect(flow.step).toBe('code');
  expect(flow.password).toBe('');
  expect(flow.message).toBe('Expired');
});
test('restart discards proof so password cannot be changed without re-verification', async () => {
  await reachPassword();
  await act(async () => { flow.restart(); });
  await act(async () => { flow.setPassword('New-password-123'); flow.setConfirmPassword('New-password-123'); });
  await act(async () => { await flow.updatePassword(); });
  expect(completePasswordRecovery).not.toHaveBeenCalled();
  expect(flow.message).toBe('Verify your email code first.');
});
