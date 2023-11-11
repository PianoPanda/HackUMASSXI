import { read32, write32 } from "./ram.js"

/**
 * Gets the value in a register
 * @param {number} n
 */
function getreg(n) {
  
}

/**
 * Sets the value in a register
 * @param {number} n
 * @param {uint32} val - what to set it to
 */
function setreg(n, val) {
  
}

function getpc() {}
function setpc() {}

/**
 * Compares numbers as unsigned integers
 * @param {number} a
 * @param {number} B
 */
function compuns(a, b) {
  let [_a, __a, _b, __b] = [a >>> 1, a & 1, b >>> 1, b & 1]
  if (_a !== _b) return _a - _b
  else return __a == __b ? 0 : __a - __b
}


export const instructions = {

  //TODO: TEST THIS
  // Type-R
  SLLI: function(rd, rs1, shamt) {

  },
  SRLI: function(rd, rs1, shamt) {

  },
  SRAI: function(rd, rs1, shamt) {

  },

  ADD: function(rd, rs1, rs2) {
    
  },
  SUB: function(rd, rs1, rs2) {

  },
  MUL: function(rd, rs1, rs2) {

  },
  SLL: function(rd, rs1, rs2) {

  },
  MULH: function(rd, rs1, rs2) {

  },
  SLT: function(rd, rs1, rs2) {

  },
  MULHSU: function(rd, rs1, rs2) {

  },
  SLTU: function(rd, rs1, rs2) {

  },
  MULHU: function(rd, rs1, rs2) {

  },
  XOR: function(rd, rs1, rs2) {

  },
  DIV: function(rd, rs1, rs2) {

  },
  SRL: function(rd, rs1, rs2) {

  },
  SRA: function(rd, rs1, rs2) {

  },
  DIVU: function(rd, rs1, rs2) {

  },
  OR: function(rd, rs1, rs2) {

  },
  REM: function(rd, rs1, rs2) {

  },
  AND: function(rd, rs1, rs2) {

  },
  REMU: function(rd, rs1, rs2) {

  },
// -------

  JALR: function(rd, rs1, imm) {
    const addr = rs1 + imm & ~1
    setreg(rd, getpc() + 4)
    setpc(getpc() + addr - 4)
  },

  //TODO: TEST THESE
  LB: function(_, rs1, _) {
    setreg(rs1, read32(getreg(rs1)) << 24 >> 24)
  },
  LH: function(_, rs1, _) {
    setreg(rs1, read32(getreg(rs1)) << 16 >> 16)
  },
  LW: function(_, rs1, _) {
    setreg(rs1, read32(getreg(rs1)))
  },
  LBU: function(_, rs1, _) {
    setreg(rs1, read32(getreg(rs1)) & 0xff)
  },
  LHU: function(_, rs1, _) {
    setreg(rs1, read32(getreg(rs1)) & 0xffff)
  },

  ADDI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) + imm)
  },
  STLI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) < imm ? 1 : 0)
  },
  SLTIU: function(rd, rs1, imm) {
    setreg(rd, compuns(getreg(rs1), imm) < 0 ? 0 : 1)
  },
  XORI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) ^ imm)
  },
  ORI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) | imm)
  },
  ANDI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) & imm)
  },

  FENCEIL: function() {},

  //TODO: TEST THIS
  JAL: function(rd, imm) {
    setreg(rd, getpc() + 4)
    setpc(getpc() + imm - 4)
  },

  CSRRW: function(rd, rs1, csr) {},
  CSRRS: function(rd, rs1, csr) {},
  CSRRC: function(rd, rs1, csr) {},
  CSRRWI: function(rd, uimm, csr) {},
  CSRRSI: function(rd, uimm, csr) {},
  CSRRCI: function(rd, uimm, csr) {},

  SB: function(rs1, rs2, imm) {},
  SH: function(rs1, rs2, imm) {},
  SW: function(rs1, rs2, imm) {},

}

function cpuSteps(steps) {
  // do CSR timer stuff

  // do timer interrupts if necessary

  // if WFI (standby) don't execute
  for (let step = 0; step < steps; step++) {

    //TODO: handle invalid access
    //ensure pc - offset < ram size => trap = 2
    //ensure pc - offset & 3 == 0 => trap = 1

    const op = read32(getpc())

    decode(op)

    //do trap stuff?
    //do break stuff?
    
    setpc(getpc() + 4)
    
  }
  
}



