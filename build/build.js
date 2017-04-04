var rollupHelper = require('rollup-helper')
rollupHelper.package = require('../package.json')
rollupHelper.compileDir('./src', './dist')
rollupHelper.compileDir('./src/messages', './dist/messages')
