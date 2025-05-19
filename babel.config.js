module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@realm/babel-plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx'
          ],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@services': './src/services',
            '@store': './src/store',
            '@models': './src/models',
            '@assets': './assets',
            '@navigation': './src/navigation'
          }
        }
      ]
    ]
  };
};