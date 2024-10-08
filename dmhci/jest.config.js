module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation|react-navigation|@react-navigation/.*|@react-native-community/.*|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-keyboard-aware-scroll-view|react-native-elements|react-native-vector-icons|react-native-web|react-native-webview|react-native-maps|react-native-image-picker|react-native-image-crop-picker|react-native-fast-image|react-native-svg|@react-native-community/async-storage|react-native-permissions|@react-native-firebase/.*))',
  ],
};
