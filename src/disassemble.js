import { decode } from "./decode"
import { read32, flushMemory } from "./ram"
import { loadbin } from "./boot"

const instructions = {
  SLLI: function (rd, rs1, shamt) { console.log("SLLI", "rd", rd, "rs1", rs1, "shamt", shamt, "\n") },
  SRLI: function (rd, rs1, shamt) { console.log("SRLI", "rd", rd, "rs1", rs1, "shamt", shamt, "\n") },
  SRAI: function (rd, rs1, shamt) { console.log("SRAI", "rd", rd, "rs1", rs1, "shamt", shamt, "\n") },

  ADD: function (rd, rs1, rs2) { console.log("ADD", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SUB: function (rd, rs1, rs2) { console.log("SUB", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  MUL: function (rd, rs1, rs2) { console.log("MUL", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SLL: function(rd, rs1, rs2) { console.log("SLL", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  MULH: function (rd, rs1, rs2) { console.log("MULH", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SLT: function (rd, rs1, rs2) { console.log("SLT", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  MULHSU: function(rd, rs1, rs2) { console.log("MULHSU", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SLTU: function (rd, rs1, rs2) { console.log("SLTU", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  MULHU: function (rd, rs1, rs2) { console.log("MULHU", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  XOR: function (rd, rs1, rs2) { console.log("XOR", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  DIV: function (rd, rs1, rs2) { console.log("DIV", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SRL: function (rd, rs1, rs2) { console.log("SRL", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  SRA: function (rd, rs1, rs2) { console.log("SRA", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  DIVU: function (rd, rs1, rs2) { console.log("DIVU", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  OR: function (rd, rs1, rs2) { console.log("OR", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  REM: function (rd, rs1, rs2) { console.log("REM", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  AND: function (rd, rs1, rs2) { console.log("AND", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },
  REMU: function (rd, rs1, rs2) { console.log("REMU", "rd", rd, "rs1", rs1, "rs2", rs2, "\n") },

  LRW: function (rd, rs1, rl, aq) { console.log("LRW", "rd", rd, "rs1", rs1, "rl", rl, "aq", aq, "\n") },
  SCW: function (rd, rs1, rs2, rl, aq) { console.log("SCW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOSWAPW: function (rd, rs1, rs2, rl, aq) { console.log("AMOSWAPW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOADDW: function (rd, rs1, rs2, rl, aq) { console.log("AMOADDW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOXORW: function (rd, rs1, rs2, rl, aq) { console.log("AMOXORW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOANDW: function (rd, rs1, rs2, rl, aq) { console.log("AMOANDW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOORW: function (rd, rs1, rs2, rl, aq) { console.log("AMOORW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOMINW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMINW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOMAXW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMAXW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOMINUW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMINUW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },
  AMOMAXUW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMAXUW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq, "\n") },

  JALR: function (rd, rs1, imm) { console.log("JALR", "rd", rd, "rs1", rs1, "imm", imm, "\n") },

  //TODO: TEST THESE
  LB: function (rd, rs1, imm) { console.log("LB", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  LH: function (rd, rs1, imm) { console.log("LH", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  LW: function (rd, rs1, imm) { console.log("LW", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  LBU: function (rd, rs1, imm) { console.log("LBU", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  LHU: function (rd, rs1, imm) { console.log("LHU", "rd", rd, "rs1", rs1, "imm", imm, "\n") },

  //TODO: TEST THESE
  SB: function (rs1, rs2, imm) { console.log("SB", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  SH: function (rs1, rs2, imm) { console.log("SH", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  SW: function (rs1, rs2, imm) { console.log("SW", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },

  ADDI: function (rd, rs1, imm) { console.log("ADDI", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  STLI: function (rd, rs1, imm) { console.log("STLI", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  SLTIU: function (rd, rs1, imm) { console.log("SLTIU", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  XORI: function (rd, rs1, imm) { console.log("XORI", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  ORI: function (rd, rs1, imm) { console.log("ORI", "rd", rd, "rs1", rs1, "imm", imm, "\n") },
  ANDI: function (rd, rs1, imm) { console.log("ANDI", "rd", rd, "rs1", rs1, "imm", imm, "\n") },

  FENCEIL: function() { console.log("FENCEIL\n") },
  FENCEIL: function () { console.log("FENCEIL\n") },

  //TODO: TEST THIS
  JAL: function (rd, imm) { console.log("JAL", "rd", rd, "imm", imm, "\n") },

  CSRRW: function (rd, rs1, csr) { console.log("CSRRW", "rd", rd, "rs1", rs1, "csr", csr, "\n") },
  CSRRS: function (rd, rs1, csr) { console.log("CSRRS", "rd", rd, "rs1", rs1, "csr", csr, "\n") },
  CSRRC: function (rd, rs1, csr) { console.log("CSRRC", "rd", rd, "rs1", rs1, "csr", csr, "\n") },
  CSRRWI: function (rd, uimm, csr) { console.log("CSRRWI", "rd", rd, "uimm", uimm, "csr", csr, "\n") },
  CSRRSI: function (rd, uimm, csr) { console.log("CSRRSI", "rd", rd, "uimm", uimm, "csr", csr, "\n") },
  CSRRCI: function (rd, uimm, csr) { console.log("CSRRCI", "rd", rd, "uimm", uimm, "csr", csr, "\n") },

  ECALL: function() { console.log("ECALL", "\n") },
  EBREAK: function () { console.log("EBREAK", "\n")  },

  LUI: function (rd, imm) { console.log("LUI", "rd", rd, "imm", imm, "\n") },

  AUIPC: function (rd, imm) { console.log("AUIPC", "rd", rd, "imm", imm, "\n") },

  BEQ: function (rs1, rs2, imm) { console.log("BEQ", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  BNE: function (rs1, rs2, imm) { console.log("BNE", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  BLT: function(rs1, rs2, imm) { console.log("BLT", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  BLTU: function(rs1, rs2, imm) { console.log("BLTU", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  BGE: function(rs1, rs2, imm) { console.log("BGE", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
  BGEU: function(rs1, rs2, imm) { console.log("BGEU", "rs1", rs1, "rs2", rs2, "imm", imm, "\n") },
 }

export async function disassemble(path) {
  flushMemory()
  const num = await loadbin(path)
  console.log(num)
  for (let i=0; i<num; i++) {
    decode(read32(i*4), instructions)
  }
  
}

