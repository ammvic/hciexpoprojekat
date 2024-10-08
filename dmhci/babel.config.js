module.exports = {
  presets: ['module:babel-preset-expo'],
  plugins: [
    "nativewind/babel", // NativeWind plugin
    'react-native-reanimated/plugin', // Reanimated plugin (ovo mora biti poslednji plugin)
  ],
};

