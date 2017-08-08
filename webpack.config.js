const path = require('path')

module.exports = {
   entry: path.join(__dirname, 'src/js', 'index.js'),
   output: {
      path: path.join(__dirname, 'dist'),
      filename: 'build.js'
   },
   module: {
      loaders: [{
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
         include: /src/
      }, {
         loader: 'babel-loader',
         test: /\.jsx?$/,
         exclude: /node_modules/,
         query: {
            presets: ['es2015', 'react', 'stage-2']
         }
      }, {
         loader: 'json-loader',
         test: /\.json$/
      }]
   }
}
