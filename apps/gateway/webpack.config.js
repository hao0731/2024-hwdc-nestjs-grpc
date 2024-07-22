const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/gateway'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/assets',
        {
          input: join(__dirname, '../../libs/todo/domain/src/assets'),
          glob: "*.proto",
          output: "./assets/proto"
        }
      ],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
