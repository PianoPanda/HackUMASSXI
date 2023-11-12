import { disassembleElves } from "./src/disassemble.js"
import loadElf, { length } from "./src/elves.js"

console.log("hi")

document.getElementById("upload").onclick = async function() {
  
  let data = document.getElementById("file").files[0];
  let entry = document.getElementById("file").files[0];
  console.log('doupload',entry,data)

  // const stuff = await disassemble(data)
  // document.getElementById("asm").innerHTML = stuff.join("<br>")

  const buffer = await data.arrayBuffer().then(arr => {
    return new Uint8Array(arr)
  })

  loadElf(buffer, "main")

  const stuff = disassembleElves(start, length)
  document.getElementById("asm").innerHTML = stuff.join("<br>")
  
}

