import { disassembleElves } from "./src/disassemble.js"
import loadElf, { length, test_base } from "./src/elves.js"
import { read32 } from "./src/ram.js"
import { cpuSteps, dump, getpc, getreg, logNear, logReg, registers, setpc, softDump, setCallback } from "./src/execute.js";

// console.log("hi")

document.getElementById("upload").onclick = async function() {
  
  let data = document.getElementById("file").files[0];
  // let entry = document.getElementById("file").files[0];
  // console.log('doupload',entry,data)

  // const stuff = await disassemble(data)
  // document.getElementById("asm").innerHTML = stuff.join("<br>")

  const buffer = await data.arrayBuffer().then(arr => {
    return new Uint8Array(arr)
  })
  console.log(buffer)

  loadElf(buffer, "main")

  console.log(read32(0x00010094))
  
  const stuff = disassembleElves(test_base, length)
  document.getElementById("asm").innerHTML = stuff.join("<br>")

  const out = document.getElementById("out")

  setCallback(a => {
        console.log("DOING IT HERE", a)
        out.innerHTML += String.fromCharCode(a)
      })

  try{
      // let i = 100
  while(true /*&& i--*/){
      softDump();

      cpuSteps(1);
  }
  } catch (exception){
      dump();
      console.log("\n\n\n\n")
      throw exception;
  }  
  
}

