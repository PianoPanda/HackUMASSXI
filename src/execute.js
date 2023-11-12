import { decode } from "./decode.js";
import { instructions as debug_instruction } from "./disassemble.js";
import { RAM_SIZE, memory, read32, write32 } from "./ram.js"
import { compuns, format32, toBinary, toHex } from "./util.js"

export const registers = new Uint32Array(32).fill(0);
registers[2] = RAM_SIZE - 4; // put sp at the top of stack
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
  [0x801]: 0x00000000, // Custom URW: shutdown.

  // Cycle counter
  [0xC00]: 0x00000000, // URO: cycle [This is uptime in cycles]

  // Vendor ID
  [0xF11]: 0xff0ff0ff, // MRO: mvendorid [Extra Credit: make this the funny number]
}
const pc = new Uint32Array(1).fill(0);

const ABIspec = [
  "zero",
  "ra",
  "sp",
  "gp",
  "tp",
  "t0",
  "t1",
  "t2",
  "s0|fp",
  "s1",
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
  "t3",
  "t4",
  "t5",
  "t6",
]
/**
 * Only prints pc and 
 */
export function softDump() {
  try {
    console.log(`[0x${toHex(pc[0])}]: ${toBinary(read32(pc[0]))}`);
    decode(read32(getpc()), debug_instruction)
  } catch (exception) {
    console.log(`Invalid pc: 0x${toHex(pc[0])}`)
    throw exception
  }
}

export function logNear(address) {
  for (let addr = Math.max(0, address - 24); addr <= Math.min(RAM_SIZE - 4, address + 24); addr += 4) {
    console.log(`[0x${toHex(addr)}]: 0x${toHex(read32(addr))}`)
  }
}

export function dump() {
  const dumpStart = 0x00
  const memRange = Array.from(memory).slice(dumpStart, dumpStart + 0x100);
  const memBlock = Array(16).fill(1).map(() => []);
  memRange.forEach((data, index) => {
    memBlock[Math.floor(index / 16)].push(data)
  })

  console.log("====CORE DUMP====");
  console.log(`pc: 0x${toHex(pc[0])}`);
  console.log(`current instruction: ${toBinary(read32(getpc()))}`);

  console.log("registers:");
  Array.from(registers).forEach((register, rindex) => {
    console.log(`\t${ABIspec[rindex].padEnd(8, ' ')}0x${toHex(register)}`);
  })

  console.log(`memory [0x${toHex(dumpStart)} - 0x${toHex(dumpStart + 0xFF)}]:`);
  memBlock.forEach(row => console.log(`\t\t${row.map(x => toHex(x, 2)).join(' ')}`));

  console.log("====END CORE DUMP====\n");
}

function readCSR(csr) {
  csr &= 0xfff;
  if (!(csr in csrData)) throw new Error(`Attempted to read CSR 0x${toHex(csr, 3)}, which is not implemented`)
  //TODO implement all side effects
  switch (csr) {
    default:
      return csrData[csr];
  }
}

function writeCSR(csr, value) {
  csr &= 0xfff;
  if (!(csr in csrData)) throw new Error(`Attempted to write CSR 0x${toHex(csr, 3)}, which is not implemented`)
  const changedBits = csrData[csr] ^ value; //TODO deal with permissions
  //TODO implement all side effects
  switch (csr) {
    case 0x800:
      process.stdout.write(String.fromCharCode(value));
      return;
    case 0x801:
      throw new Error(`Pretend this is a graceful shutdown with exit value ${value}!`);
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
 * Logs a specific register value
 * @param {string} name 
 */
export function logReg(name) {
  const reg = ABIspec.findIndex(x => x.includes(name))
  if(reg === -1) throw new Error(`${name} is not a register`)
  console.log(
    `\t${name} = 0x${toHex(registers[reg])}`
  )
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
  SLLI: function (rd, rs1, shamt) {
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
  SLL: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) << (getreg(rs2) & 0b11111))
  },
  MULH: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1) | 0) * BigInt(getreg(rs2) | 0) >> BigInt(32)))
  },
  SLT: function (rd, rs1, rs2) {
    setreg(rd, (getreg(rs1) | 0) < (getreg(rs2) | 0) ? 1 : 0)
  },
  MULHSU: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1) | 0) * BigInt(getreg(rs2)) >> BigInt(32)))
  },
  SLTU: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) < getreg(rs2) ? 1 : 0)
  },
  MULHU: function (rd, rs1, rs2) {
    setreg(rd, Number(BigInt(getreg(rs1)) * BigInt(getreg(rs2)) >> BigInt(32)))
  },
  XOR: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) ^ getreg(rs2))
  },
  DIV: function (rd, rs1, rs2) {
    if (getreg(rs2) === 0) setreg(rd, -1)
    else setreg(rd, (getreg(rs1) | 0) / (getreg(rs2) | 0) | 0)
  },
  SRL: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) >> (getreg(rs2) & 0b11111))
  },
  SRA: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) >>> (getreg(rs2) & 0b11111))
  },
  DIVU: function (rd, rs1, rs2) {
    if (getreg(rs2) === 0) setreg(rd, -1 | 0);
    else setreg(rd, Math.trunc(getreg(rs1) / getreg(rs2)));
  },
  OR: function (rd, rs1, rs2) {
    setreg(rd, getreg(rs1) | getreg(rs2))
  },
  REM: function (rd, rs1, rs2) {
    setreg(rd, (getreg(rs2) | 0) % (getreg(rs1) | 0))
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

  //TODO: TEST THIS
  JAL: function (rd, imm) {
    setreg(rd, getpc() + 4)
    setpc(getpc() + imm - 4)
  },

  JALR: function (rd, rs1, imm) {
    setreg(rd, getpc() + 4)
    setpc(((getreg(rs1) + imm) & ~1) - 4) //accounting for auto-increment of pc
    /*
      "The target address is obtained by adding the sign-extended
      12-bit I-immediate to the register rs1, then setting the
      least-significant bit of the result to zero."
    */
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
    write32(getreg(rs1) + imm, getreg(rs2) << 24 >> 24)
  },
  SH: function (rs1, rs2, imm) {
    write32(getreg(rs1) + imm, getreg(rs2) << 16 >> 16)
  },
  SW: function (rs1, rs2, imm) {
    write32(getreg(rs1) + imm, getreg(rs2))
  },

  ADDI: function (rd, rs1, imm) {
    setreg(rd, getreg(rs1) + imm)
  },
  SLTI: function (rd, rs1, imm) {
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
    setreg(rd, imm);
  },

  AUIPC: function (rd, imm) {
    setreg(rd, getpc() + imm)
  },

  BEQ: function (rs1, rs2, imm) {
    if (getreg(rs1) == getreg(rs2))
      setpc((getpc() - 4) + imm)
  },
  BNE: function (rs1, rs2, imm) {
    if (getreg(rs1) != getreg(rs2))
      setpc((getpc() - 4) + imm)
  },
  BLT: function (rs1, rs2, imm) {
    if ((getreg(rs1) | 0) < (getreg(rs2) | 0))
      setpc((getpc() - 4) + imm)
  },
  BLTU: function (rs1, rs2, imm) {
    if (getreg(rs1) < getreg(rs2))
      setpc((getpc() - 4) + imm)
  },
  BGE: function (rs1, rs2, imm) {
    if ((getreg(rs1) | 0) >= (getreg(rs2) | 0))
      setpc((getpc() - 4) + imm)
  },
  BGEU: function (rs1, rs2, imm) {
    if (getreg(rs1) >= getreg(rs2))
      setpc((getpc() - 4) + imm)
  },

}

export function cpuSteps(steps) {
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



