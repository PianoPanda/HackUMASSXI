import { cpuSteps, dump, getpc, getreg, logNear, logReg, registers, setpc, softDump } from "./execute";
import loadELF from "./elves";
import * as fs from "fs"
import { exit } from "process";
import { toHex } from "./util";

const elfData = new Uint8Array(fs.readFileSync(Bun.argv[2]))
loadELF(elfData);

console.log("\n\n\n\n")
console.log("====BEGIN TRACE====")
try{
    let i = 10000
while(true && i--){
    // console.log()
    softDump();
    // console.log(toHex(registers[1]))
            // logReg('a4')
            // logReg('a5')
    switch(getpc()){
        case 0x100f4:
        case 0x100f8:
        case 0x100fc:
            // logReg('a4')
            logReg('a0')
    }

    cpuSteps(1, (a) => {
        console.log("HERE", a)
    });
}
} catch (exception){
    dump();
    console.log("\n\n\n\n")
    throw exception;
}