import { loadbin } from "./loadlocal";
import { cpuSteps, dump, getpc, getreg, logNear, registers, setpc, softDump } from "./execute";
import { toHex } from "./util";

await loadbin(Bun.argv[2]);
console.log("\n\n\n\n")
console.log("====BEGIN TRACE====")
setpc(0x148) //Start location
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