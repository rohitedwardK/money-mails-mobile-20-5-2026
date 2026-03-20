// module.exports = {
//   // presets: [
//   //   // 'module:metro-react-native-babel-preset'
//   //   'module:@react-native/babel-preset'
//   // ],
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin',
//   ],
//   env: {
//     production: {
//       plugins: ['react-native-paper/babel'],
//     },
//   },
// };

module.exports = {
  presets: [
    'module:@react-native/babel-preset'
  ],

  plugins: [
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};

