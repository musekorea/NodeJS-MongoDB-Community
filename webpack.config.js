const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    style: '/public/js/style.js',
    article: '/public/js/article.js',
    changePassword: '/public/js/changePassword.js',
    comments: '/public/js/comments.js',
    community: '/public/js/community.js',
    editArticle: '/public/js/editArticle.js',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/[name].js',
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    new CopyPlugin({
      patterns: [{ from: 'public/images', to: 'images' }],
    }),
  ],
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
      {
        test: /\.(png|svg|jpe?g|gif|webp)$/,
        use: ['file-loader'],
      },
    ],
  },
};
