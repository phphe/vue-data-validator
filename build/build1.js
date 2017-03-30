var fs = require('fs')
var path = require('path')
var rollup = require('rollup')
// var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel')
var _package = require('../package.json')
var banner =
    '/*!\n' +
    ' * ' + _package.name + ' v' + _package.version + '\n' +
    ' * ' + _package.author + '\n' +
    ' * ' + (_package.repository && _package.repository.url) + '\n' +
    ' * Released under the ' + _package.license + ' License.\n' +
    ' */\n'

rollupDir('./src', './dist')
rollupDir('./src/messages', './dist/messages')

function rollupDir(dir, outputDir) {
  fs
  .readdirSync(dir)
  .filter(item => fs.statSync(dir + '/' + item).isFile() && item.match(/\.js$/))
  .forEach(item => rollupFile(dir + '/' + item, outputDir))
}
function rollupFile(filePath, outputDir) {
  const name = path.parse(filePath).name
  rollup.rollup({
    entry: filePath,
    plugins: [
      babel({
        presets: ['es2015-loose-rollup']
      })
    ]
  })
  .then(function (bundle) {
    var temp = path.relative(path.resolve('./src'), path.resolve(filePath)).replace('/', '_').replace('\\', '_')
    var moduleName = camelCase(_package.name + '_' + temp)
    return write(`${outputDir}/${name}.js`, bundle.generate({
      format: 'umd',
      banner: banner,
      moduleName: moduleName
    }).code, bundle)
  })
  .catch(logError)
}

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve(bundle)
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
function studlyCase (str) {
  return str && (str[0].toUpperCase() + str.substr(1))
}
function camelCase (str) {
  const temp = str.toString().split(/[-_]/)
  for (let i = 1; i < temp.length; i++) {
    temp[i] = studlyCase(temp[i])
  }
  return temp.join('')
}
