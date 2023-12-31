import assert from "assert";
import { getreg, setreg, instructions, setpc } from "./execute.js"
import { expect, test } from "bun:test";
import { read32, write32, flushMemory } from "./ram.js";

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
test("ADD: 1 + 2", () => {
  setreg(1, 1);
  setreg(2, 2);
  instructions.ADD(3, 1, 2);
  assert(getreg(3) === 3)
})

test("ADD: 1 + (-2)", () => {
  setreg(1, 1)
  setreg(2, 0xFFFF_FFFE)
  instructions.ADD(3, 1, 2);
  assert(getreg(3) === 0xFFFF_FFFF) //todo
})

test("ADD: (-1) + 2", () => {
  setreg(1, 0xFFFF_FFFF)
  setreg(2, 2)
  instructions.ADD(3, 1, 2);
  assert(getreg(3), 1) //todo
})

test("ADD: (-1) + (-2)", () => {
  setreg(1, 0xFFFF_FFFF)
  setreg(2, 0xFFFF_FFFE)
  instructions.ADD(3, 1, 2);
  assert(getreg(3), 0xFFFF_FFFD) //todo
})

test("SUB: Two Positives", () => {
  setreg(1, 1)
  setreg(2, 99)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(98)
})

test("SUB: Two Negatives", () => {
  setreg(1, -1999)
  setreg(2, -9999)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(-8000)
})

test("SUB: Pos & Neg", () => {
  setreg(1, 25)
  setreg(2, -125)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(-150)
})

test("SUB: zeros", () => {
  setreg(1, 0)
  setreg(2, 123)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(123)

  setreg(1, 0)
  setreg(2, -321)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(-321)

  setreg(1, 123)
  setreg(2, 0)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(-123)

  setreg(1, -321)
  setreg(2, 0)
  instructions.SUB(3, 1, 2)
  expect(getreg(3) | 0).toBe(321)
})

test("DIV: zero", () => {
  setreg(1, 2)
  setreg(2, 0)
  instructions.DIV(3, 1, 2)
  expect(getreg(3)|0).toBe(-1)
})

test("DIV: regular division", () => {
  setreg(1, 2)
  setreg(2, 1)
  instructions.DIV(3, 1, 2)
  expect(getreg(3) | 0).toBe(2)

  setreg(1, 10)
  setreg(2, 3)
  instructions.DIV(3, 1, 2)
  expect(getreg(3) | 0).toBe(3)

  setreg(1, -99)
  setreg(2, 3)
  instructions.DIV(3, 1, 2)
  expect(getreg(3) | 0).toBe(-33)
})

test("DIVU: suite", () => {
  // 2 / 1 = 2
  setreg(1, 2);
  setreg(2, 1);
  instructions.DIVU(3, 1, 2);
  expect(getreg(3)).toBe(2); //todo

  // Div by zero follows spec semantics
  setreg(1, 2);
  setreg(2, 0);
  instructions.DIVU(3, 1, 2);
  expect(getreg(3)).toBe((-1>>>0)); //todo
})

test("MUL: typical imput", () => {
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

// r1 -> 0xDEADDEAD
// r2 =  0xCAFECAFE
// The AMO tests are based on the following interpretation:
// r1 is a pointer, while r2 is a number
// Each AMO operation is atomic(obviously)
// First, the memory stored at r1 is loaded into rd
// Secondly, the memory stored at r1 is operated with r2
// Lastly, the result is stored at r1
test("AMOSWAPW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOSWAPW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xCAFECAFE | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xDEADDEAD);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOADDW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOADDW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xA9ACA9AB | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOXORW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOXORW(3, 1, 2, 0, 0);
  assert(read32(100) === (0x14531453 | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOANDW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOANDW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xCAACCAAC | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOORW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOORW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xDEFFDEFF | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOMINW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOMINW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xCAFECAFE | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOMINW: pos/neg", () => {
  write32(100, 0xFFFF_FFFF);
  setreg(1, 100);
  setreg(2, 0x0000_0001)
  instructions.AMOMINW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xFFFF_FFFF | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0x0000_0001);
  assert(getreg(3) === 0xFFFF_FFFF);
})

test("AMOMAXW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOMAXW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xDEADDEAD | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOMAXW: pos/neg", () => {
  write32(100, 0xFFFF_FFFF);
  setreg(1, 100);
  setreg(2, 0x0000_0001)
  instructions.AMOMAXW(3, 1, 2, 0, 0);
  assert(read32(100) === (0x0000_0001 | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0x0000_0001);
  assert(getreg(3) === 0xFFFF_FFFF);
})

test("AMOMINUW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOMINUW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xCAFECAFE | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("AMOMAXUW", () => {
  write32(100, 0xDEADDEAD);
  setreg(1, 100);
  setreg(2, 0xCAFECAFE)
  instructions.AMOMAXUW(3, 1, 2, 0, 0);
  assert(read32(100) === (0xDEADDEAD | 0));
  assert(getreg(1) === 100);
  assert(getreg(2) === 0xCAFECAFE);
  assert(getreg(3) === 0xDEADDEAD);
})

test("SLLI", () => {
  setreg(1, 3)
  instructions.SLLI(2, 1, 2)
  assert(getreg(2) == 12)
})

test("SRLI", () => {
  setreg(1, 12)
  instructions.SRLI(2, 1, 2)
  assert(getreg(2) == 3)

  setreg(1, -12)
  instructions.SRLI(2, 1, 2)
  expect(getreg(2)|0).toBe(1073741821)
  
})

test("SRAI", () => {
  setreg(1, -8)
  instructions.SRAI(2, 1, 3)
  expect(getreg(2)|0).toBe(-1)

  setreg(1, -12)
  instructions.SRAI(2, 1, 2)
  expect(getreg(2)|0).toBe(-3)
})

test("SLL", () => {
  setreg(1, 5)
  setreg(2, 0b100010)
  instructions.SLL(3, 1, 2)
  expect(getreg(3)).toBe(20)
})

test("SRL", () => {
  setreg(1, 20)
  setreg(2, 0b100010)
  instructions.SRL(3, 1, 2)
  expect(getreg(3)).toBe(5)
})

test("MULH", () => {
  setreg(1, 0x0fffffff)
  setreg(2, 0x000fffff)
  instructions.MULH(3, 1, 2)
  expect(getreg(3)).toBe(0xffff)

  setreg(1, 0xf0000000)
  setreg(2, 0x0fffffff)
  instructions.MULH(3, 1, 2)
  expect(getreg(3)|0).toBe(-16777216)
})

test("SLT", () => {
  setreg(1, 0xdeedaa)
  setreg(2, 2)
  setreg(3, 3)
  instructions.SLT(1, 2, 3)
  expect(getreg(1)).toBe(1)

  instructions.SLT(1, 3, 2)
  expect(getreg(1)).toBe(0)
})

test("MULHSU", () => {
  setreg(2, 0xfff00000) //signed
  setreg(1, 0xf0000000) //unsigned
  instructions.MULHSU(3, 1, 2)
  expect(getreg(3)|0).toBe(0xf0010000|0)
})

test("SLTU", () => {
  setreg(3, 0xdeedaa)
  setreg(1, 0xf0000001)
  setreg(2, 0xf0000002)
  instructions.SLTU(3, 1, 2)
  expect(getreg(3)).toBe(1)

  instructions.SLTU(3, 2, 1)
  expect(getreg(3)).toBe(0)

})

test("MULHU", () => {
  setreg(1, 0x000fffff)
  setreg(2, 0x0000ffff)
  instructions.MULHU(3, 1, 2)
  expect(getreg(3)).toBe(0xf)
})

test("XOR", () => {
  setreg(1, 0b1001)
  setreg(2, 0b1010)
  instructions.XOR(3, 1, 2)
  expect(getreg(3)).toBe(0b0011)
})

test("SRA", () => {
  setreg(1, -8)
  setreg(3, 3)
  instructions.SRAI(2, 1, 3)
  expect(getreg(2)|0).toBe(-1)

  setreg(1, -12)
  setreg(2, 2)
  instructions.SRAI(2, 1, 2)
  expect(getreg(2)|0).toBe(-3)
  
})

test("LB", () => {
  flushMemory()
  write32(0, 0xdeedeeda)
  setreg(1, 12)
  instructions.LB(2, 1, -12)
  expect(getreg(2)|0).toBe(0xda << 24 >> 24)
})
test("LH", () => {
  flushMemory()
  write32(0, 0xdeedeeda)
  setreg(1, 12)
  instructions.LH(2, 1, -12)
  expect(getreg(2)|0).toBe(0xeeda << 16 >> 16)
  
})
test("LW", () => {
  flushMemory()
  write32(0, 0xdeedeeda)
  setreg(1, 12)
  instructions.LW(2, 1, -12)
  expect(getreg(2)).toBe(0xdeedeeda)
  
})

