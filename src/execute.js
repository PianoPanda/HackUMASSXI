import { read32, write32 } from "./ram.js"
import { compuns, format32 } from "./util.js"

const registers = new Uint32Array(32).fill(0);
const csrData = {
  // Trap handler setup
  [0x300]: 0x00000000, // MRW: mstatus [refer to privileged: 3.1.6 Machine Status Registers for info]
  [0x301]: 0x40401101, // MRW: misa [why is this read/write????? this is a constant representing enabled RISC-V extensions]
  [0x304]: 0x00000000, // MRW: mie [bit i represents if interrupt i is enabled]
  [0x305]: 0x00000000, // MRW: mtvec [first 30 bits represent base address, last 2 bits represent Direct or Vectored]

  // Trap stuff
  [0x340]: 0x00000000, // MRW: mscratch [Machine mode only scratch register]
  [0x341]: 0x00000000, // MRW: mepc [When an interrupt happens, the old PC is loaded here]
  [0x342]: 0x00000000, // MRW: mcause [First bit is whether an interrupt caused it, next bits are a cause of an exception]
  [0x343]: 0x00000000, // MRW: mtval [Page fault address]
  [0x344]: 0x00000000, // MRW: mip [bit i represents if interrupt i is currently enqueued]

  // Custom IO
  [0x800]: 0x00000000, // Custom URW: value unused. write to write to term, read to read from term(non-blocking).

  // Cycle counter
  [0xC00]: 0x00000000, // URO: cycle [This is uptime in cycles]

  // Vendor ID
  [0xF11]: 0xff0ff0ff, // MRO: mvendorid [Extra Credit: make this the funny number]
}
const pc = Uint32Array(1).fill(0);

function readCSR(csr) {
  if (!csr in csrData) throw new Error(`Attempted to read CSR 0x${toHex(csr, 3)}, which is not implemented`)
  //TODO implement all side effects
  switch (csr) {
    default:
      return csrData[csr];
  }
}

function writeCSR(csr, value) {
  if (!csr in csrData) throw new Error(`Attempted to write CSR 0x${toHex(csr, 3)}, which is not implemented`)
  const changedBits = csrData[csr] ^ value; //TODO deal with permissions
  //TODO implement all side effects
  switch (csr) {
    case 0x800:
      console.log(`wrote ${value} to CSR 0x800`);
      return;
    case 0xC00:
      return;
    case 0xF11:
      return;
    default:
      csrData[csr] = value;
  }
}

/**
 * Gets the value in a register
 * @param {number} n
 * @returns {number}
 */
export function getreg(n) {
  return registers[n]
}

/**
 * Sets the value in a register
 * @param {number} n
 * @param {uint32} val - what to set it to
 */
export function setreg(n, val) {
  if (n !== 0) registers[n] = val & 0xffffffff;
}

/**
 * Returns the current value of pc
 * @returns {number}
 */
export function getpc() { return pc[0] }
/**
 * Sets pc to `value`.
 * EXTERNAL USE FOR TESTING ONLY.
 * @param {number} value 
 */
export function setpc(value) { pc[0] = value }

export const instructions = {

  //TODO: TEST THIS
  // Type-R
  SLLI: function (rd, rs1, shamt) { //TODO SLLI SRLI SRAI lowkey confusing someone double check this
    setreg(rd, getreg(rs1) << shamt)
  },
  SRLI: function (rd, rs1, shamt) {
    setreg(rd, getreg(rs1) >>> shamt)
  },
  SRAI: function (rd, rs1, shamt) {
    setreg(rd, getreg(rs1) >> shamt)
  },

  ADD: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) + getreg(rs2))
  },
  SUB: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs2) - getreg(rs1))
  },
  MUL: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt.asIntN(32, BigInt(getreg(rs1)) * BigInt(getreg(rs2)))))
  },
  SLL: function(rd, rs1, rs2) {
    setreg(rd, getreg(rs1) << (getreg(rs2) & 0b11111))
  },
  MULH: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1)|0) * BigInt(getreg(rs2)|0) >>> BigInt(32)))
  },
  SLT: function (rd, rs1, rs2) {
    setreg(rd, (getreg(rs1)|0) < (getreg(rs2)|0) ? 1 : 0)
  },
  MULHSU: function(rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1)|0) * BigInt(getreg(rs2)) >>> BigInt(32)))
  },
  SLTU: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) < getreg(rs2) ? 1 : 0)
  },
  MULHU: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1)) * BigInt(getreg(rs2)) >>> BigInt(32)))
  },
  XOR: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) ^ getreg(rs2))
  },
  DIV: function (rd, rs1, rs2) { //signed division
    if (getreg(rs2) === 0) throw new Exception("Signed division by 0")
    setreg(rd, (getreg(rs1)|0) / (getreg(rs2)|0))
  },
  SRL: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) >> (getreg(rs2) & 0b11111))
  },
  SRA: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) >>> (getreg(rs2) & 0b11111))
  },
  DIVU: function (rd, rs1, rs2) {
    if (rs2 === 0) throw new Exception("Unsigned division by 0")
    setreg(rd, (getreg(rs1) / getreg(rs2))|0)
  },
  OR: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) | getreg(rs2))
  },
  REM: function (rd, rs1, rs2) {
    setreg(rd, (getreg(rs2)|0) % (getreg(rs1)|0))
  },
  AND: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) & getreg(rs2))
  },
  REMU: function (rd, rs1, rs2) {
    setreg(rd, (getreg(rs2)) % (getreg(rs1)))
  },

  LRW: function (rd, rs1, rl, aq) {

  },
  SCW: function (rd, rs1, rs2, rl, aq) {

  },
  AMOSWAPW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rs2, arg1);
    write32(getreg(rs1), arg2);
    setreg(rd, arg1);
  },
  AMOADDW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = arg1 + arg2
    write32(getreg(rs1), result)
  },
  AMOXORW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = arg1 ^ arg2
    write32(getreg(rs1), result)
  },
  AMOANDW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = arg1 & arg2
    write32(getreg(rs1), result)
  },
  AMOORW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = arg1 | arg2
    write32(getreg(rs1), result)
  },
  AMOMINW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = Math.min(arg1 | 0, arg2 | 0)
    write32(getreg(rs1), result)
  },
  AMOMAXW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = read32(getreg(rs1));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = Math.max(arg1 | 0, arg2 | 0)
    write32(getreg(rs1), result)
  },
  AMOMINUW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = format32(read32(getreg(rs1)));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = Math.min(arg1, arg2)
    write32(getreg(rs1), result)
  },
  AMOMAXUW: function (rd, rs1, rs2, rl, aq) {
    let arg1 = format32(read32(getreg(rs1)));
    let arg2 = getreg(rs2);
    setreg(rd, arg1);
    const result = Math.max(arg1, arg2)
    write32(getreg(rs1), result)
  },
  // -------

  JALR: function (rd, rs1, imm) {
    const addr = rs1 + imm & ~1
    setreg(rd, getpc() + 4)
    setpc(getpc() + addr - 4)
  },

  //TODO: TEST THESE
  LB: function (rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) << 24 >> 24)
  },
  LH: function (rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) << 16 >> 16)
  },
  LW: function (rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm))
  },
  LBU: function (rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) & 0xff)
  },
  LHU: function (rd, rs1, imm) {
    setreg(rd, read32(getreg(rs1) + imm) & 0xffff)
  },

  //TODO: TEST THESE
  SB: function (rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2 << 24 >> 24)
  },
  SH: function (rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2 << 16 >> 16)
  },
  SW: function (rs1, rs2, imm) {
    write32(getreg(rs1) + imm, rs2)
  },

  ADDI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) + imm)
  },
  STLI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) < imm ? 1 : 0)
  },
  SLTIU: function (rd, rs1, imm) {
    setreg(rd, compuns(getreg(rs1), imm) < 0 ? 0 : 1)
  },
  XORI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) ^ imm)
  },
  ORI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) | imm)
  },
  ANDI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) & imm)
  },

  FENCEIL: function () { },

  //TODO: TEST THIS
  JAL: function (rd, imm) {
    setreg(rd, getpc() + 4)
    setpc(getpc() + imm - 4)
  },

  CSRRW: function (rd, rs1, csr) {
    const source = getreg(rs1);
    if (rd !== 0) setreg(rd, readCSR(csr));
    writeCSR(csr, source);
  },
  CSRRS: function (rd, rs1, csr) {
    const source = getreg(rs1);
    setreg(rd, readCSR(csr));
    if (rs1 !== 0) writeCSR(csr, oldCSR | source);
  },
  CSRRC: function (rd, rs1, csr) {
    const source = getreg(rs1);
    setreg(rd, readCSR(csr));
    if (rs1 !== 0) writeCSR(csr, oldCSR & !source);
  },
  CSRRWI: function (rd, uimm, csr) {
    const source = uimm;
    if (rd !== 0) setreg(rd, readCSR(csr));
    writeCSR(csr, source);
  },
  CSRRSI: function (rd, uimm, csr) {
    const source = uimm;
    setreg(rd, readCSR(csr));
    if (uimm !== 0) writeCSR(csr, oldCSR | source);
  },
  CSRRCI: function (rd, uimm, csr) {
    const source = uimm;
    setreg(rd, readCSR(csr));
    if (uimm !== 0) writeCSR(csr, oldCSR & !source);
  },

  ECALL: function () { },
  EBREAK: function () { },

  LUI: function (rd, imm) {
    setreg(rd, Number(BigInt(imm) << 12n));
  },

  AUIPC: function (rd, imm) {
    const displacement = BigInt(imm) << 12n;
    setreg(rd, Number((BigInt(getpc()) + displacement) & 0xFFFF_FFFFn))
  },

  BEQ: function (rs1, rs2, imm) {
    if (getreg(rs1) == getreg(rs2))
      setpc((getpc()+4) + imm << 1) 
  },
  BNE: function (rs1, rs2, imm) {
    if (getreg(rs1) != getreg(rs2))
      setpc((getpc()+4) + imm << 1) 
  },
  BLT: function(rs1, rs2, imm) {
    if ((getreg(rs1)|0) < (getreg(rs2)|0))
      setpc((getpc()+4) + imm << 1) 
  },
  BLTU: function(rs1, rs2, imm) {
    if (getreg(rs1) < getreg(rs2))
      setpc((getpc()+4) + imm << 1) 
  },
  BGE: function(rs1, rs2, imm) {
    if ((getreg(rs1)|0) >= (getreg(rs2)|0))
      setpc((getpc()+4) + imm << 1) 
  },
  BGEU: function(rs1, rs2, imm) {
    if (getreg(rs1) >= getreg(rs2))
      setpc((getpc()+4) + imm << 1) 
  },
  
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
    csrData[0xC00]++; //Increment cycle counter

  }

}



