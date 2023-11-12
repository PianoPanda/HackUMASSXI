import { loadbin } from "./load.js"
import { read32, flushMemory } from "./ram.js"
import { test } from "bun:test";

test.skip("tests loadbin", async () => {
  flushMemory()
  let num = await loadbin("testfileartifacts/fnAndBranch/test.bin")
  console.log("found", read32(0), num)
})