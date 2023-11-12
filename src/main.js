import { loadbin } from "./boot";
import { cpuSteps, dump } from "./execute";

await loadbin(Bun.argv[2]);
while(true){
    dump();
    cpuSteps(1);
}