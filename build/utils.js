const fs = require('fs')
const path = require('path')
class Utils{
  static getAllFiles(dirRoot, type, flag) {
    let filterReg = new RegExp('.' + type + '$')
    function getAllFileFromDir(root) {
      let res = [], files = fs.readdirSync(root)
      files.forEach((file) => {
        let pathname = root + '/' + file,
          state = fs.lstatSync(pathname)
        if (!state.isDirectory()){
          filterReg.test(pathname) && res.push(pathname)
        } else {
          if (flag){
            res = res.concat(getAllFileFromDir(pathname))
          }
        }
      })
      return res
    }
    return getAllFileFromDir(dirRoot)
  }


  // fn 函数返回entry 的key值
  static getEntry(files, fn) {
    let entry = {}
    files.forEach((file) => {
      let name = fn(file)
      entry[name] = file
    })
    return entry
  }
}
let files = Utils.getAllFiles(path.resolve(__dirname, '../src/pages/'), 'js', true)
// let entry = Utils.getEntry(files, (file) => {
//   return /\/(\w+)\.js$/.exec(file).pop()
// })
module.exports = Utils
