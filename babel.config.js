// need to install $ yarn add --dev babel-plugin-module-resolver
// and run with `expo start -c` to clear cache
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin', [
      'module-resolver',
      {
        root: ["./src"],
        alias: {
          '~': './src',
        },
      },
    ],
    '@babel/transform-react-jsx-source',
    'babel-plugin-transform-typescript-metadata',
    ],
  };
};
