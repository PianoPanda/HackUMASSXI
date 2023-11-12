import { cpuSteps, dump, getpc, getreg, logNear, logReg, registers, setpc, softDump } from "./execute";
import loadELF from "./elves";
import * as fs from "fs"
import { exit } from "process";

const elfData = new Uint8Array(fs.readFileSync(Bun.argv[2]))
loadELF(elfData, "main");

console.log("\n\n\n\n")
console.log("====BEGIN TRACE====")
try{
while(true){
    // console.log()
    // softDump();
    // console.log(toHex(registers[1]))
    // switch(getpc()){
    //     case 0x10c:
    //     case 0x12c:
    //     console.log(`stack pointer: 0x${toHex(registers[2])}`)
    //     logNear(registers[2])
    // }

    cpuSteps(1);
}
} catch (exception){
    dump();
    console.log("\n\n\n\n")
    throw exception;
}