import { loadbin } from "./boot";
import { cpuSteps, dump, registers, setpc, softDump } from "./execute";
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
    cpuSteps(1);
}
} catch (exception){
    dump();
    console.log("\n\n\n\n")
    throw exception;
}