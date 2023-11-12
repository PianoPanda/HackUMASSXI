import { decode } from "./decode"
import { read32 } from "./ram"

const instructions = {
  SLLI: function (rd, rs1, shamt) { console.log("SLLI", "rd", rd, "rs1", rs1, "shamt", shamt) },
  SRLI: function (rd, rs1, shamt) { console.log("SRLI", "rd", rd, "rs1", rs1, "shamt", shamt) },
  SRAI: function (rd, rs1, shamt) { console.log("SRAI", "rd", rd, "rs1", rs1, "shamt", shamt) },

  ADD: function (rd, rs1, rs2) { console.log("ADD", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SUB: function (rd, rs1, rs2) { console.log("SUB", "rd", rd, "rs1", rs1, "rs2", rs2) },
  MUL: function (rd, rs1, rs2) { console.log("MUL", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SLL: function(rd, rs1, rs2) { console.log("SLL", "rd", rd, "rs1", rs1, "rs2", rs2) },
  MULH: function (rd, rs1, rs2) { console.log("MULH", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SLT: function (rd, rs1, rs2) { console.log("SLT", "rd", rd, "rs1", rs1, "rs2", rs2) },
  MULHSU: function(rd, rs1, rs2) { console.log("MULHSU", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SLTU: function (rd, rs1, rs2) { console.log("SLTU", "rd", rd, "rs1", rs1, "rs2", rs2) },
  MULHU: function (rd, rs1, rs2) { console.log("MULHU", "rd", rd, "rs1", rs1, "rs2", rs2) },
  XOR: function (rd, rs1, rs2) { console.log("XOR", "rd", rd, "rs1", rs1, "rs2", rs2) },
  DIV: function (rd, rs1, rs2) { console.log("DIV", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SRL: function (rd, rs1, rs2) { console.log("SRL", "rd", rd, "rs1", rs1, "rs2", rs2) },
  SRA: function (rd, rs1, rs2) { console.log("SRA", "rd", rd, "rs1", rs1, "rs2", rs2) },
  DIVU: function (rd, rs1, rs2) { console.log("DIVU", "rd", rd, "rs1", rs1, "rs2", rs2) },
  OR: function (rd, rs1, rs2) { console.log("OR", "rd", rd, "rs1", rs1, "rs2", rs2) },
  REM: function (rd, rs1, rs2) { console.log("REM", "rd", rd, "rs1", rs1, "rs2", rs2) },
  AND: function (rd, rs1, rs2) { console.log("AND", "rd", rd, "rs1", rs1, "rs2", rs2) },
  REMU: function (rd, rs1, rs2) { console.log("REMU", "rd", rd, "rs1", rs1, "rs2", rs2) },

  LRW: function (rd, rs1, rl, aq) { console.log("LRW", "rd", rd, "rs1", rs1, "rl", rl, "aq", aq) },
  SCW: function (rd, rs1, rs2, rl, aq) { console.log("SCW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOSWAPW: function (rd, rs1, rs2, rl, aq) { console.log("AMOSWAPW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOADDW: function (rd, rs1, rs2, rl, aq) { console.log("AMOADDW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOXORW: function (rd, rs1, rs2, rl, aq) { console.log("AMOXORW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOANDW: function (rd, rs1, rs2, rl, aq) { console.log("AMOANDW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOORW: function (rd, rs1, rs2, rl, aq) { console.log("AMOORW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOMINW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMINW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOMAXW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMAXW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOMINUW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMINUW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },
  AMOMAXUW: function (rd, rs1, rs2, rl, aq) { console.log("AMOMAXUW", "rd", rd, "rs1", rs1, "rs2", rs2, "rl", rl, "aq", aq) },

  JALR: function (rd, rs1, imm) { console.log("JALR", "rd", rd, "rs1", rs1, "imm", imm) },

  //TODO: TEST THESE
  LB: function (rd, rs1, imm) { console.log("LB", "rd", rd, "rs1", rs1, "imm", imm) },
  LH: function (rd, rs1, imm) { console.log("LH", "rd", rd, "rs1", rs1, "imm", imm) },
  LW: function (rd, rs1, imm) { console.log("LW", "rd", rd, "rs1", rs1, "imm", imm) },
  LBU: function (rd, rs1, imm) { console.log("LBU", "rd", rd, "rs1", rs1, "imm", imm) },
  LHU: function (rd, rs1, imm) { console.log("LHU", "rd", rd, "rs1", rs1, "imm", imm) },

  //TODO: TEST THESE
  SB: function (rs1, rs2, imm) { console.log("SB", "rs1", rs1, "rs2", rs2, "imm", imm) },
  SH: function (rs1, rs2, imm) { console.log("SH", "rs1", rs1, "rs2", rs2, "imm", imm) },
  SW: function (rs1, rs2, imm) { console.log("SW", "rs1", rs1, "rs2", rs2, "imm", imm) },

  ADDI: function (rd, rs1, imm) { console.log("ADDI", "rd", rd, "rs1", rs1, "imm", imm) },
  STLI: function (rd, rs1, imm) { console.log("STLI", "rd", rd, "rs1", rs1, "imm", imm) },
  SLTIU: function (rd, rs1, imm) { console.log("SLTIU", "rd", rd, "rs1", rs1, "imm", imm) },
  XORI: function (rd, rs1, imm) { console.log("XORI", "rd", rd, "rs1", rs1, "imm", imm) },
  ORI: function (rd, rs1, imm) { console.log("ORI", "rd", rd, "rs1", rs1, "imm", imm) },
  ANDI: function (rd, rs1, imm) { console.log("ANDI", "rd", rd, "rs1", rs1, "imm", imm) },

  FENCEIL: function() { },

  FENCEIL: function () { },

  //TODO: TEST THIS
  JAL: function (rd, imm) { console.log("JAL", "rd", rd, "imm", imm) },

  CSRRW: function (rd, rs1, csr) { console.log("CSRRW", "rd", rd, "rs1", rs1, "csr", csr) },
  CSRRS: function (rd, rs1, csr) { console.log("CSRRS", "rd", rd, "rs1", rs1, "csr", csr) },
  CSRRC: function (rd, rs1, csr) { console.log("CSRRC", "rd", rd, "rs1", rs1, "csr", csr) },
  CSRRWI: function (rd, uimm, csr) { console.log("CSRRWI", "rd", rd, "uimm", uimm, "csr", csr) },
  CSRRSI: function (rd, uimm, csr) { console.log("CSRRSI", "rd", rd, "uimm", uimm, "csr", csr) },
  CSRRCI: function (rd, uimm, csr) { console.log("CSRRCI", "rd", rd, "uimm", uimm, "csr", csr) },

  ECALL: function() { console.log("ECALL") },
  EBREAK: function () { console.log("EBREAK")  },

  LUI: function (rd, imm) { console.log("LUI", "rd", rd, "imm", imm) },

  AUIPC: function (rd, imm) { console.log("AUIPC", "rd", rd, "imm", imm) },

  BEQ: function (rs1, rs2, imm) { console.log("BEQ", "rs1", rs1, "rs2", rs2, "imm", imm) },
  BNE: function (rs1, rs2, imm) { console.log("BNE", "rs1", rs1, "rs2", rs2, "imm", imm) },
  BLT: function(rs1, rs2, imm) { console.log("BLT", "rs1", rs1, "rs2", rs2, "imm", imm) },
  BLTU: function(rs1, rs2, imm) { console.log("BLTU", "rs1", rs1, "rs2", rs2, "imm", imm) },
  BGE: function(rs1, rs2, imm) { console.log("BGE", "rs1", rs1, "rs2", rs2, "imm", imm) },
  BGEU: function(rs1, rs2, imm) { console.log("BGEU", "rs1", rs1, "rs2", rs2, "imm", imm) },
 }

export async function disassemble(path) {
  const num = await loadbin(path)
  for (let i=0; i<num; i++) {
    decode(read32(i*4), instructions)
  }
  
}

