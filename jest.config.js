module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|@tanstack|react-native-config|@react-native-google-signin|react-native-confirmation-code-field|react-native-reanimated|react-native-reanimated-carousel|react-native-gesture-handler|react-native-vector-icons|react-native-phone-number-input|react-native-country-picker-modal|react-native-webview|rn-country-picker)/)',
  ],
};
