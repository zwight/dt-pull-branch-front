const path = require('path');

const finalKoConfig = (function () {
  const ROOT_PATH = process.cwd();
  const APP_PATH = path.resolve(ROOT_PATH, 'src');
  const BUILD_PATH = path.resolve(ROOT_PATH, `dist`);
  const WEB_PUBLIC = path.resolve(ROOT_PATH, 'public');
  const baseKoConfig = {
    entry: path.join(APP_PATH, './index.tsx'),
    outputPath: BUILD_PATH,
    publicPath: './',
    staticPath: APP_PATH,
    htmlTemplate: path.join(ROOT_PATH, './public/index.html'),
    alias: {
      '@': path.resolve('src'),
      assets: path.resolve('public/assets/'),
      styles: path.resolve('src/styles/'),
      utils: path.resolve('src/utils/'),
    },
    serve: {
      staticPath: path.join(process.cwd(), './public'),
    },
    copy: [
      {
        from: path.resolve(WEB_PUBLIC),
        to: path.resolve(BUILD_PATH, 'public'),
        globOptions: {
          dot: true,
          gitignore: true,
          ignore: ['**/index.html'],
        },
      },
    ],
    // more config can find in https://dtstack.github.io/ko/docs/current/configuration
  };
  // You can add extra ko config here
  const extraConfig = {};
  // You can add extra plugins config here
  const plugins = [];
  const config = { ...baseKoConfig, ...extraConfig, plugins };
  return config;
})();

module.exports = finalKoConfig;