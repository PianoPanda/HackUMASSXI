import { decode } from "./decode.js"
import { read32, flushMemory } from "./ram.js"
import { loadbin } from "./load.js"

let out

function respretty(name, ...k) {
  return function(...v) {
    const res = []
    for (let i=0; i<v.length; i++)
      res.push(`${k[i]}: ${v[i]}`)

    out = `${name} ${res.join(", ")}`
  }
}

export const instructions = {
  SLLI: respretty("SLLI", "rd", "rs1", "shamt"),
  SRLI: respretty("SRLI", "rd", "rs1", "shamt"),
  SRAI: respretty("SRAI", "rd", "rs1", "shamt"),

  ADD: respretty("ADD", "rd", "rs1", "rs2"),
  SUB: respretty("SUB", "rd", "rs1", "rs2"),
  MUL: respretty("MUL", "rd", "rs1", "rs2"),
  SLL: respretty("SLL", "rd", "rs1", "rs2"),
  MULH: respretty("MULH", "rd", "rs1", "rs2"),
  SLT: respretty("SLT", "rd", "rs1", "rs2"),
  MULHSU: respretty("MULHSU", "rd", "rs1", "rs2"),
  SLTU: respretty("SLTU", "rd", "rs1", "rs2"),
  MULHU: respretty("MULHU", "rd", "rs1", "rs2"),
  XOR: respretty("XOR", "rd", "rs1", "rs2"),
  DIV: respretty("DIV", "rd", "rs1", "rs2"),
  SRL: respretty("SRL", "rd", "rs1", "rs2"),
  SRA: respretty("SRA", "rd", "rs1", "rs2"),
  DIVU: respretty("DIVU", "rd", "rs1", "rs2"),
  OR: respretty("OR", "rd", "rs1", "rs2"),
  REM: respretty("REM", "rd", "rs1", "rs2"),
  AND: respretty("AND", "rd", "rs1", "rs2"),
  REMU: respretty("REMU", "rd", "rs1", "rs2"),

  LRW: respretty("LRW", "rd", "rs1", "rl", "aq"),
  SCW: respretty("SCW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOSWAPW: respretty("AMOSWAPW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOADDW: respretty("AMOADDW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOXORW: respretty("AMOXORW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOANDW: respretty("AMOANDW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOORW: respretty("AMOORW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOMINW: respretty("AMOMINW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOMAXW: respretty("AMOMAXW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOMINUW: respretty("AMOMINUW", "rd", "rs1", "rs2", "rl", "aq"),
  AMOMAXUW: respretty("AMOMAXUW", "rd", "rs1", "rs2", "rl", "aq"),

  JALR: respretty("JALR", "rd", "rs1", "imm"),

  //TODO: TEST THESE
  LB: respretty("LB", "rd", "rs1", "imm"),
  LH: respretty("LH", "rd", "rs1", "imm"),
  LW: respretty("LW", "rd", "rs1", "imm"),
  LBU: respretty("LBU", "rd", "rs1", "imm"),
  LHU: respretty("LHU", "rd", "rs1", "imm"),

  //TODO: TEST THESE
  SB: respretty("SB", "rs1", "rs2", "imm"),
  SH: respretty("SH", "rs1", "rs2", "imm"),
  SW: respretty("SW", "rs1", "rs2", "imm"),

  ADDI: respretty("ADDI", "rd", "rs1", "imm"),
  SLTI: respretty("SLTI", "rd", "rs1", "imm"),
  SLTIU: respretty("SLTIU", "rd", "rs1", "imm"),
  XORI: respretty("XORI", "rd", "rs1", "imm"),
  ORI: respretty("ORI", "rd", "rs1", "imm"),
  ANDI: respretty("ANDI", "rd", "rs1", "imm"),

  FENCEIL: respretty("FENCEIL"),
  FENCEIL: respretty("FENCEIL"),

  //TODO: TEST THIS
  JAL: respretty("JAL", "rd", "imm"),

  CSRRW: respretty("CSRRW", "rd", "rs1", "csr"),
  CSRRS: respretty("CSRRS", "rd", "rs1", "csr"),
  CSRRC: respretty("CSRRC", "rd", "rs1", "csr"),
  CSRRWI: respretty("CSRRWI", "rd", "uimm", "csr"),
  CSRRSI: respretty("CSRRSI", "rd", "uimm", "csr"),
  CSRRCI: respretty("CSRRCI", "rd", "uimm", "csr"),

  ECALL: respretty("ECALL"),
  EBREAK: respretty("EBREAK"),

  LUI: respretty("LUI", "rd", "imm"),

  AUIPC: respretty("AUIPC", "rd", "imm"),

  BEQ: respretty("BEQ", "rs1", "rs2", "imm"),
  BNE: respretty("BNE", "rs1", "rs2", "imm"),
  BLT: respretty("BLT", "rs1", "rs2", "imm"),
  BLTU: respretty("BLTU", "rs1", "rs2", "imm"),
  BGE: respretty("BGE", "rs1", "rs2", "imm"),
  BGEU: respretty("BGEU", "rs1", "rs2", "imm"),
 }

export async function disassemble(path) {
  flushMemory()
  const res = []
  const num = await loadbin(path)
  for (let i=0; i<num/4; i++) {
    decode(read32(i*4), instructions)
    res.push(out)
  }

  return res
}


export function disassembleElves(start, length) {
  const res = []
  for (let i=start; i<start+length; i += 4) {
    decode(read32(i), instructions)
    res.push(out)
  }
  return res
}
