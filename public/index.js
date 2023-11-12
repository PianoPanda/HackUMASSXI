import { disassemble } from "./src/disassemble.js"

console.log("hi")

document.getElementById("upload").onclick = async function() {
  
  let data = document.getElementById("file").files[0];
  let entry = document.getElementById("file").files[0];
  console.log('doupload',entry,data)

  await disassemble(data)
}

