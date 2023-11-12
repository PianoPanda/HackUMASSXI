import { loadbin } from "./boot";
import { cpuSteps, dump } from "./execute";

const BINARY_PATH = "testfileartifacts/asm_test.bin";

await loadbin(BINARY_PATH);
while(true){
    dump();
    cpuSteps(1);
}