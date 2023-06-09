// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// module.exports = async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);
//   return {
//     resolver: {
//       ...defaultConfig.resolver,
//       assetExts: [...defaultConfig.resolver.assetExts, 'bin', 'txt', 'jpg', 'ttf', 'png', 'm4a', 'mp4', 'otf'],
//       sourceExts: [...defaultConfig.resolver.sourceExts, 'js', 'json', 'ts', 'tsx', 'jsx'],
//     },
//     // Add any other custom configuration options for Metro bundler here
//   };
// };


const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  'bin', 'txt', 'jpg', 'ttf', 'png', 'm4a', 'mp4', 'otf', 'mp3'
);

config.resolver.sourceExts.push(
  'js', 'json', 'ts', 'tsx', 'jsx'
);

module.exports = config;
