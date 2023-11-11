/**
 * Enum for types of instruction
 * @readonly
 * @enum {number}
 */
const TYPES = {
  R: 0,
  I: 1,
  S: 2,
  B: 3,
  U: 4,
  J: 5,
  OTHER: 6
}

/**
 * bitsfrom - extract bits from number: from what (start, start + nbits]
 * @param {uint32} what
 * @param {number} start - start bit counting from the right, high
 * @param {number} nbits - number of bits to gather
 */
export function bitsfrom(what, start, nbits) {
  if (nbits == 0) throw new Error("nbits must be > 0");
  return (what << (32 - (nbits + start))) >>> 32 - nbits;
}

/**
 * Combines an array of bits of given lengths into one 32 bit num
 * @param {[uint32, number][]} data - [bits, length] 
 * @returns {uint32} - output 32 bit number
 */
export function combine(data) {
  let ret = 0;
  let count = 0;
  for (const [bits, len] of data) {
    ret |= ((bits & (-1 >>> 32 - len)) << (32 - (count + len)));
    count += len;
  }
  // if (count != 32) throw new Error("Bits must fill uint32 exactly.");
  return ret >>> 32 - count;
}

function swap32(val) {
  return ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);
}

/**
 * Decodes a single instruction and calls the function
 * @param {uint32} op - 32 bit assembly instruction
 * @param {Object} i - instructions
 */
export function decode(op, i) {
  op = swap32(op)

  const opcode = op & 0b1111111;

  const type = gettype(opcode)

  switch (type) {
    case TYPES.R:
      {
        const rd = bitsfrom(op, 7, 5);
        const funct3 = bitsfrom(op, 12, 3);
        const rs1 = bitsfrom(op, 15, 5);
        const rs2 = bitsfrom(op, 20, 5)
        const funct7 = bitsfrom(op, 25, 7)
        const rl = bitsfrom(op, 25, 1)
        const aq = bitsfrom(op, 26, 1)
        const funct7A = bitsfrom(op, 27, 5)

        switch (opcode) {
          case 0b0010011: 
            switch (funct3) {
              case 0b001: i.SLLI(rd, rs1, shamt); break
              case 0b101:
                switch (funct7) {
                  case 0b0000000: i.SRLI(rd, rs1, shamt); break
                  case 0b0100000: i.SRAI(rd, rs1, shamt); break
                  default:
                    throw new Error(f`SRLI or SRAI wrong ${op.toString(16)}`)
                }
                break
              default: 
                throw new Error(f`Illegal func for instruction ${op.toString(16)}`)
            }
            break;
          case 0b0110011:
            switch (funct3) {
              case 0b000:
                switch (funct7) {
                  case 0b0000000: i.ADD(rd, rs1, rs2); break
                  case 0b0100000: i.SUB(rd, rs1, rs2); break
                  case 0b0000001: i.MUL(rd, rs1, rs2); break
                  default:
                    throw new Error(f`ADD or SUB or MUL wrong ${op.toString(16)}`)
                }
                break
              case 0b001:
                switch (funct7) {
                  case 0b0000000: i.SLL(rd, rs1, rs2); break
                  case 0b0000001: i.MULH(rd, rs1, rs2); break
                  default:
                    throw new Error(f`SLL or MULH wrong ${op.toString(16)}`)
                }
                break
              case 0b010: 
                switch (funct7) {
                  case 0b0000000: i.SLT(rd, rs1, rs2); break
                  case 0b0000001: i.MULHSU(rd, rs1, rs2); break
                  default:
                    throw new Error(f`SLT or MULHSU wrong ${op.toString(16)}`)
                }
                break
              case 0b011: 
                switch (funct7) {
                  case 0b0000000: i.SLTU(rd, rs1, rs2); break
                  case 0b0000001: i.MULHU(rd, rs1, rs2); break
                  default:
                    throw new Error(f`SLTU or MULHU wrong ${op.toString(16)}`)
                }
                break
              case 0b100:
                switch (funct7) {
                  case 0b0000000: i.XOR(rd, rs1, rs2); break
                  case 0b0000001: i.DIV(rd, rs1, rs2); break
                  default:
                    throw new Error(f`XOR or DIV wrong ${op.toString(16)}`)
                }
                break
              case 0b101:
                switch (funct7) {
                  case 0b0000000: i.SRL(rd, rs1, rs2); break
                  case 0b0100000: i.SRA(rd, rs1, rs2); break
                  case 0b0000001: i.DIVU(rd, rs1, rs2); break
                  default:
                    throw new Error(f`SRL or SRA or DIVU wrong ${op.toString(16)}`)
                }
                break
              case 0b110:
                switch (funct7) {
                  case 0b0000000: i.OR(rd, rs1, rs2); break
                  case 0b0000001: i.REM(rd, rs1, rs2); break
                  default: 
                    throw new Error(f`OR or REM wrong ${op.toString(16)}`)
                }
                break
              case 0b111:
                switch (funct7) {
                  case 0b0000000: i.AND(rd, rs1, rs2); break
                  case 0b0000001: i.REMU(rd, rs1, rs2); break
                  default:
                    throw new Error(f`AND or REMU wrong ${op.toString(16)}`)
                }
                break
              default:
                throw new Error(f`0b0110011 stuff ${op.toString(16)}`)
            }
            break;
          case 0b0101111: 
            switch(funct7A) {
              case 0b00010: i.LRW(rd, rs1, rl, aq); break //rs2 is 00000
              case 0b00011: i.SCW(rd, rs1, rs2, rl, aq); break
              case 0b00001: i.AMOSWAPW(rd, rs1, rs2, rl, aq); break
              case 0b00000: i.AMOADDW(rd, rs1, rs2, rl, aq); break
              case 0b00100: i.AMOXORW(rd, rs1, rs2, rl, aq); break
              case 0b01100: i.AMOANDW(rd, rs1, rs2, rl, aq); break
              case 0b01000: i.AMOORW(rd, rs1, rs2, rl, aq); break
              case 0b10000: i.AMOMINW(rd, rs1, rs2, rl, aq); break
              case 0b10100: i.AMOMAXW(rd, rs1, rs2, rl, aq); break
              case 0b11000: i.AMOMINUW(rd, rs1, rs2, rl, aq); break
              case 0b11100: i.AMOMAXUW(rd, rs1, rs2, rl, aq); break
              default:
                throw new Error(f`illegal RV32A extension instructions ${op.toString(16)}`)
            }
            break;
          default: 
            throw new Error(f`illegal type R stuff ${op.toString(16)}`) 
        }
      }
      break;
    case TYPES.I:
      {
        const rd = bitsfrom(op, 7, 5);
        const func3 = bitsfrom(op, 12, 3); 
        const rs1 = bitsfrom(op, 15, 5);
        const imm = bitsfrom(op, 20, 12) << 20 >> 20;
      
        switch (opcode) {
          case 0b1100111:
            switch (func3) {
              case 0b000: i.JALR(rd, rs1, imm); break
              default:
                throw new Error(f`Illegal func for instruction ${op.toString(16)}`)
            }
          case 0b0000011:
            switch (func3) {
              case 0b000: i.LB(rd, rs1, imm); break
              case 0b001: i.LH(rd, rs1, imm); break
              case 0b010: i.LW(rd, rs1, imm); break
              case 0b100: i.LBU(rd, rs1, imm); break
              case 0b101: i.LHU(rd, rs1, imm); break
              default:
                throw new Error(f`Illegal func for instruction ${op.toString(16)}`)
            }
            break
          case 0b0010011:
            switch (func3) {
              case 0b000: i.ADDI(rd, rs1, imm); break
              case 0b001: i.SLTI(rd, rs1, imm); break
              case 0b011: i.SLTIU(rd, rs1, imm); break
              case 0b100: i.XORI(rd, rs1, imm); break
              case 0b110: i.ORI(rd, rs1, imm); break
              case 0b111: i.ANDI(rd, rs1, imm); default:
                throw new Error(f`Illegal func for instruction ${op.toString(16)}`)
            }
          //FENCE.I it's a noop I guess?
          case 0b0001111: i.FENCEI(); break
          case 0b1110011: {
            switch (func3) {
              case 0b001: i.CSRRW(rd, rs1, imm); break
              case 0b010: i.CSRRS(rd, rs1, imm); break
              case 0b011: i.CSRRC(rd, rs1, imm); break
              case 0b101: i.CSRRWI(rd, rs1, imm); break
              case 0b110: i.CSRRSI(rd, rs1, imm); break
              case 0b111: i.CSRRCI(rd, rs1, imm); break
              default:
                throw new Error(`Illegal func for instruction ${op.toString(16)}`)
            }
          }
          default:
            throw new Error(`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.S:
      {
        const imm_0_4 = bitsfrom(op, 7, 5)
        const funct3 = bitsfrom(op, 12, 3)
        const rs1 = bitsfrom(op, 15, 5)
        const rs2 = bitsfrom(op, 20, 5)
        const imm_5_11 = bitsfrom(op, 25, 7)

        const imm = combine([[imm_0_4, 5], [imm_5_11, 7]])

        switch (opcode) {
          case 0b0100011:
            switch (funct3) {
              case 0b000: i.SB(rs1, rs2, imm); break
              case 0b001: i.SH(rs1, rs2, imm); break
              case 0b010: i.SW(rs1, rs2, imm); break
              default:
                throw new Error(`Illegal func for instruction ${op.toString(16)}`)
            }
            break
          default:
            throw new Error(`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.B:
      {
        const imm_11 = bitsfrom(op, 7, 1);
        const imm_1_4 = bitsfrom(op, 8, 4);
        const func3 = bitsfrom(op, 12, 3);
        const rs1 = bitsfrom(op, 15, 5);
        const rs2 = bitsfrom(op, 20, 5);
        const imm_5_10 = bitsfrom(op, 25, 6);
        const imm_12 = bitsfrom(op, 31, 1);

        const imm = combine([[0, 1], [imm_1_4, 4], [imm_5_10, 6], [imm_11, 1], [imm_12, 1]])

        switch (opcode) {
          case 0b1100111:
            switch (func3) {
              case 0b000: i.BEQ(rs1, rs2, imm); break
              case 0b001: i.BNE(rs1, rs2, imm); break
              case 0b100: i.BLT(rs1, rs2, imm); break
              case 0b101: i.BGE(rs1, rs2, imm); break
              case 0b110: i.BLTU(rs1, rs2, imm); break
              case 0b111: i.BGEU(rs1, rs2, imm); break
              default:
                throw new Error(`Illegal func for instruction ${op.toString(16)}`)
            }   
            break
          default:
            throw new Error(`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.U:
      //TODO: fill out
      break;
    case TYPES.J:
      {
        const rd = bitsfrom(op, 7, 5);
        const imm_12_19 = bitsfrom(op, 12, 8);
        const imm_11 = bitsfrom(op, 19, 1)
        const imm_1_10 = bitsfrom(op, 20, 10)
        const imm_20 = bitsfrom(op, 31, 1)

        const imm = combine([[0, 1], [imm_1_10, 10], [imm_11, 1], [imm_12_19, 8], [imm_20, 1]]) << 12 >> 12
      
        switch (opcode) {
          case 0b1101111: i.JAL(rd, imm); break
          default:
            throw new Error(`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.OTHER:
      switch (opcode) {
        case 0b0001111:
          {
            const rd = bitsfrom(op, 7, 5)
            const funct3 = bitsfrom(op, 12, 3)
            const rs1 = bitsfrom(op, 15, 5)
            const succ = bitsfrom(op, 20, 4)
            const pred = bitsfrom(op, 24, 4)
            const fm = bitsfrom(op, 28, 4)

            if (funct3) throw new Error(`Illegal funct3 for instruction ${op.toString(16)}`)
            else if (!rd && !rs1 && succ == 0b0011 && pred == 0b0011 && fm == 0b1000) i.FENCETSO()
            else if (!rd && !rs1 && succ == 0b0000 && pred == 0b0001 && fm == 0b0000) i.PAUSE()
            else i.FENCE(rd, rs1, succ, pred, fm)
          }
          break
        case 0b1110011:
          switch (op) {
            case 115: i.ECALL(); break
            case 1048691: i.EBREAK(); break
            default:
              throw new Error(`Illegal instruction`)
          }
          break
        default:
          throw new Error(`Illegal opcode for instruction ${op.toString(16)}`)
      }
      break;
    default:
      throw new Error(`Illegal type for instruction ${op.toString(16)}`) 
  }
}

function gettype(opcode) {
  switch (opcode) {
    //R-type
    case 0b0110011:
    case 0b0010011:
    case 0b0101111:
      return TYPES.R;
    //I-type
    case 0b1100111:
    case 0b0000011:
    case 0b0010011:
    case 0b0001111:
    case 0b1110011:
      return TYPES.I;
    //S-type
    case 0b0100011:
      return TYPES.S;
    //B-type
    case 0b1100011:
      return TYPES.B
    //U-type
    case 0b0110111:
    case 0b0010111:
      return TYPES.U
    //J-type
    case 0b1101111:
      return TYPES.J
    //OTHER-type
    case 0b0001111:
    case 0b1110011:
      return TYPES.OTHER
  }
}
