import assert from "assert";
import { getreg, setreg, instructions, setpc } from "./execute.js"
import { test } from "bun:test";

const testExecutable = new Uint8Array(
  new Uint32Array([
    0x064000ef, 0xfd010113, 0x02112623, 0x02812423, 0x03010413, 0xfca42e23,
    0xfcb42c23, 0xfe042623, 0x0200006f, 0xfdc42703, 0xfd842783, 0x40f707b3,
    0xfcf42e23, 0xfec42783, 0x00178793, 0xfef42623, 0xfdc42703, 0xfd842783,
    0xfce7eee3, 0xfec42783, 0x00078513, 0x02c12083, 0x02812403, 0x03010113,
    0x00008067, 0xfe010113, 0x00112e23, 0x00812c23, 0x02010413, 0x00c00793,
    0xfef42623, 0x00400793, 0xfef42423, 0xfec42783, 0xfe842703, 0x00070593,
    0x00078513, 0xf71ff0ef, 0x00050793, 0xfef42223, 0xfe442783, 0x0037c793,
    0x00078513, 0x01c12083, 0x01812403, 0x02010113, 0x00008067,
  ]).buffer
);
//entry at pc=0x00
//should return (a5 = 0)

test("MUL", () => {
  setreg(1, 4)
  setreg(2, 5)
  instructions.MUL(3, 1, 2)
  assert(getreg(3) == 20)
})

test("MUL: large values", () => {
  setreg(1, 0xFFFF_FFFF)
  setreg(2, 0xFFFF_FFFF)
  instructions.MUL(3, 1, 2)
  assert(getreg(3) === 1)
})

test("LUI: typical input", () => {
  instructions.LUI(1, 1)
  assert(getreg(1) === 0x0000_1000)
})

test("LUI: high input", () => {
  instructions.LUI(1, 0x000F_FFFF)
  assert(getreg(1) === 0xFFFF_F000)
})

test("AUIPC: low pc, low imm", () => {
  setpc(0x0000_0ABC)
  instructions.AUIPC(1, 1)
  assert(getreg(1) === 0x0000_1ABC)
})

test("AUIPC: low pc, high imm", () => {
  setpc(0x0000_0ABC)
  instructions.AUIPC(1, 0x000F_FFFF)
  assert(getreg(1) === 0xFFFF_FABC)
})

test("AUIPC: high pc, low imm", () => {
  setpc(0xABCD_1234)
  instructions.AUIPC(1, 0x0000_0001)
  assert(getreg(1) === 0xABCD_2234)
})

test("AUIPC: high pc, high imm", () => {
  setpc(0xABCD_1234)
  instructions.AUIPC(1, 0x000F_FFFF)
  assert(getreg(1) === 0xABCD_0234)
})
