module.exports = {
  entry: {
    'validator-and-options': './index.js',
    'validator': './validator.js',
    'options': './options.js'
  },
  output: {
      path: __dirname + '/dist', // 输出文件的保存路径
      filename: '[name].js' // 输出文件的名称
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loader: 'coffee'
      }
    ]
  }
 }
