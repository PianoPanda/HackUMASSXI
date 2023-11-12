import * as fs from "fs"
import { write32 } from "./ram";

export async function loadbin(path) {
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
}