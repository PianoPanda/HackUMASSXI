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
  JALR: function(rd, rs1, imm) {
    const addr = rs1 + imm & ~1
    setreg(rd, getpc() + 4)
    setpc(getpc() + addr - 4)
  },

  //TODO: TEST THESE
  LB: function(rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) << 24 >> 24)
  },
  LH: function(rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) << 16 >> 16)
  },
  LW: function(rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm))
  },
  LBU: function(rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) & 0xff)
  },
  LHU: function(rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) & 0xffff)
  },

  //TODO: TEST THESE
  SB: function(rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2 << 24 >> 24)
  },
  SH: function(rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2 << 16 >> 16)
  },
  SW: function(rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2)
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

  ECALL: function() {},
  EBREAK: function() {},

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

    decode(op, instructions)

    //do trap stuff?
    //do break stuff?
    
    setpc(getpc() + 4)
    
  }
  
}



