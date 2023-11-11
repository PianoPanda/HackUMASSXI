import assert from "assert";
import { RAM_SIZE, read32, write32 } from "./ram";
import { test } from "bun:test";

test("endianness works", () => {
  write32(0, 0xaabbccdd);
  //[DD, CC, BB, AA]
  write32(4, 0x11223344);
  //[44, 33, 22, 11]
  assert(read32(2) === 0x3344aabb);
});

test("valid bounds", () => {
  write32(0, 0xdeaddead);
  write32(RAM_SIZE - 4, 0xdeaddead);
  let numErrors = 0;
  try {
    write32(-1, 0xdeaddead);
  } catch (error) {
    numErrors++;
  }
  try {
    write32(RAM_SIZE - 3, 0xdeaddead);
  } catch (error) {
    numErrors++;
  }
  assert(numErrors === 2);
});
