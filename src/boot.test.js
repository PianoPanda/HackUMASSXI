import { loadbin } from "./boot.js"
import { read32, flushMemory } from "./ram.js"
import { test } from "bun:test";

test("tests loadbin", async () => {
  flushMemory()
  await loadbin("testfileartifacts/test.bin")
  console.log("found", read32(0))
})