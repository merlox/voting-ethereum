const path = require('path')

module.exports = {
   entry: path.join(__dirname, 'src/js', 'index.js'),
   output: {
      path: path.join(__dirname, 'dist'),
      filename: 'build.js'
   },
   module: {
      loaders: [
      {
         loader: 'babel-loader',
         test: /\.jsx?$/,
         exclude: /node_modules/,
         query: {
            presets: ['es2015', 'react', 'stage-2']
         }
      }, {
         loader: 'css-loader!style-loader',
         test: /\.css$/
      }, {
         loader: 'json-loader',
         test: /\.json$/
      }]
   }
}
