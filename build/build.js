const Bili = require('bili');
const fs = require('fs');

bundleDir('src')
bundleDir('src/messages', 'messages')

function bundleDir(dir, outDir = '') {
  fs.readdirSync(dir).forEach(fn => {
    const fp = dir + '/' + fn
    if (!fs.lstatSync(fp).isFile()) {
      return
    }
    let name = fn.split('.')[0]
    if (name === 'index') {
      name = null
    }
    Bili.write({input: fp, name, format: ['cjs', 'umd', 'umd-min', 'es'], outDir: 'dist/' + outDir, banner: true}).then(() => {
    })
  })
}
