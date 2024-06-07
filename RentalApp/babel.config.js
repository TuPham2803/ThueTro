module.exports = function(api) {
  api.cache(false); // Disable caching

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv']
    ]
  };
};
