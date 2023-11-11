import { read32, write32 } from "./ram.js"
import { compuns } from "./util.js"

const registers = Uint32Array(32).fill(0);
const csr = {
  [0x300]: 0x00000000, // MRW: mstatus [refer to privileged: 3.1.6 Machine Status Registers for info]
  [0x301]: 0x40401101, // MRW: misa [why is this read/write????? this is a constant representing enabled RISC-V extensions]
  [0x304]: 0x00000000, // MRW: mie [bit i represents if interrupt i is enabled]
  [0x305]: 0x00000000, // MRW: mtvec [first 30 bits represent base address, last 2 bits represent Direct or Vectored]

  [0x340]: 0x00000000, // MRW: mscratch [Machine mode only scratch register]
  [0x341]: 0x00000000, // MRW: mepc 
  [0x342]: 0x00000000, // MRW: mcause
  [0x343]: 0x00000000, // MRW: mtval
  [0x344]: 0x00000000, // MRW: mip [bit i represents if interrupt i is pending???? TODO]

  [0xC00]: 0x00000000, // URO: cycle [This is uptime in cycles]

  [0xF11]: 0xff0ff0ff, // MRO: mvendorid [Extra Credit: make this the funny number]
}

/**
 * Gets the value in a register
 * @param {number} n
 * @returns {number}
 */
function getreg(n) {
  return registers[n]
}

/**
 * Sets the value in a register
 * @param {number} n
 * @param {uint32} val - what to set it to
 */
function setreg(n, val) {
  if(n !== 0) registers[n] = val & 0xffffffff;
}

function getpc() {}
function setpc() {}

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
    setreg(rd, rs1 + rs2)
  },
  SUB: function(rd, rs1, rs2) {
    setreg(rd, rs2 - rs1)
  },
  MUL: function(rd, rs1, rs2) {
    setreg(rd, BigInt(rs1) * BigInt(rs2))
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

  LRW: function(rd, rs1, rl, aq) {

  },
  SCW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOSWAPW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOADDW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOXORW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOANDW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOORW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMINW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMAXW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMINUW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMAXW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMINUW: function(rd, rs1, rs2, rl, aq) {

  },
  AMOMAXUW: function(rd, rs1, rs2, rl, aq) {

  },
// -------

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



