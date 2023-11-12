import { loadbin } from "./boot";
import { cpuSteps, dump, softDump } from "./execute";

await loadbin(Bun.argv[2]);
console.log("\n\n\n\n")
console.log("====BEGIN TRACE====")
try{
while(true){
    softDump();
    cpuSteps(1);
}
} catch (exception){
    dump();
    console.log("\n\n\n\n")
    throw exception;
}