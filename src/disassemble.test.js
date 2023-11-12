import { disassemble } from "./disassemble"

test("tests dissassembly", async () => {
  await disassemble("testfileartifacts/fnAndBranch/test.bin")
})