import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-reanimated-carousel', () => {
  const React = require('react');
  const {View} = require('react-native');
  return props => <View testID="carousel">{props.children}</View>;
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({data: {user: {}}})),
  },
}));

jest.mock('react-native-config', () => ({}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-snackbar', () => ({
  LENGTH_SHORT: 1500,
  LENGTH_LONG: 2750,
  show: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  PERMISSIONS: {
    ANDROID: {POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS'},
    IOS: {NOTIFICATIONS: 'ios.permission.NOTIFICATIONS'},
  },
  RESULTS: {GRANTED: 'granted', DENIED: 'denied'},
}));

jest.mock('react-native-email-link', () => ({
  openInbox: jest.fn(() => Promise.resolve()),
  openComposer: jest.fn(() => Promise.resolve()),
  getEmailClients: jest.fn(() => Promise.resolve([])),
}));
