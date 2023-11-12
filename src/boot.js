import { write32 } from "./ram.js"
// import * as fs from "fs"

/*export async function loadbin(path) {
  return new Promise(resolve => fs.open(path, "r", function(err, fd) {
    if (err) throw err
    const buffer = Buffer.alloc(4)
    let [i, num] = [0, -1];
    while (num) {
      num = fs.readSync(fd, buffer, 0, 4, null)
      write32(i++*4, buffer.readInt32LE())
    }
    resolve(i)
  }))
}*/

export async function loadbin(file) {
  return file.arrayBuffer().then(arr => {
    const int8arr = new Int8Array(arr)
    for (let i=0; i<int8arr.length; i++) {
      write32(i, int8arr[i])
    }
    return int8arr.length
  })
}



