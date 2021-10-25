const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: { style: './public/js/style.js' },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/[name].js',
    clean: true,
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'css/style.css' })],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
};
