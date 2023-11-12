import { disassemble } from "./disassemble"

test.skip("tests dissassembly", async () => {
  await disassemble("testfileartifacts/fnAndBranch/test.bin")
})