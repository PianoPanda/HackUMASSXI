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
  if (count != 32) throw new Error("Bits must fill uint32 exactly.");
  return ret;
}

/**
 * Decodes a single instruction and calls the function
 * @param {uint32} op - 32 bit assembly instruction
 * @param {Object} i - instructions
 */
export function decode(op, i) {

  const opcode = op & 0b1111111;

  const type = gettype(opcode)

  //TODO: fill out 
  switch (type) {

    case TYPES.R:
      //TODO: fill out
      {const rd = bitsfrom(op, 7, 5);
      const funct3 = bitsfrom(op, 12, 3);
      const rs1 = bitsfrom(op, 15, 5);
      const rs2 = bitsfrom(op, 20, 5)
      let funct7 = bitsfrom(op, 25, 7)
      
      switch (opcode) {
        case 0b0010011: 
        switch (funct3) {
          case 0b001: r.SLLI(rd, rs1, rs2)//SLLI, shamt, logical left shift
            //TODO:
            
            funct7 = 0b0000000
            break
          case 0b101:
            switch (funct7) {
              case 0b0000000: //TODO SRLI, shamt, logical right shift 
              case ob0100000: //TODO SRAI, shamt, arithmetic right shift
              default:
                throw new Exception(f`SRLI or SRAI wrong ${op.toString(16)}`)
            }
          default: 
            throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
        }
        case 0b0110011:
        switch (funct3) {
          case 0b000: //ADD or SUB
            switch (funct7) {
              case 0b0000000: //ADD
                //TODO:
              case 0b0100000: //SUB
                //TODO:
              case 0b0000001: //MUL
                //TODO:
              default:
                throw new Exception(f`ADD or SUB or MUL wrong ${op.toString(16)}`)
            }
          case 0b001: //SLL
            switch (funct7) {
              case 0b0000000: //SLL
                //TODO:
              case 0b0000001: //MULH
                //TODO:
              default:
                throw new Exception(f`SLL or MULH wrong ${op.toString(16)}`)
            }
          case 0b010: 
            switch (funct7) {
              case 0b0000000: //SLT
                //TODO: 
              case 0b0000001: //MULHSU
                //TODO:
              default:
                throw new Exception(f`SLT or MULHSU wrong ${op.toString(16)}`)
            }
          case 0b011: 
            switch (funct7) {
              case 0b0000000: //SLTU
                //TODO:
              case 0b0000001: //MULHU
                //TODO:
              default:
                throw new Exception(f`SLTU or MULHU wrong ${op.toString(16)}`)
            }
          case 0b100: //XOR
            switch (funct7) {
              case 0b0000000: //XOR
                //TODO:
              case 0b0000001: //DIV
                //TODO:
              default:
                throw new Exception(f`XOR or DIV wrong ${op.toString(16)}`)
            }
          case 0b101: //SRL or SRA
            switch (funct7) {
              case 0b0000000: //SRL
                //TODO:
              case 0b0100000: //SRA
                //TODO:
              case 0b0000001: //DIVU
                //TODO:
              default:
                throw new Exception(f`SRL or SRA or DIVU wrong ${op.toString(16)}`)
            }
          case 0b110: //OR
            switch (funct7) {
              case 0b0000000: //OR
                //TODO:
              case 0b0000001: //REM
                //TODO:
              default: 
                throw new Exception(f`OR or REM wrong ${op.toString(16)}`)
            }
          case 0b111: //AND
            //TODO:
            switch (funct7) {
              case 0b0000000: //AND
                //TODO:
              case 0b0000001: //REMU
                //TODO:
              default:
                throw new Exception(f`AND or REMU wrong ${op.toString(16)}`)
            }
        }
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
                throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
            }
          case 0b0000011:
            switch (func3) {
              case 0b000: i.LB(rd, rs1, imm); break
              case 0b001: i.LH(rd, rs1, imm); break
              case 0b010: i.LW(rd, rs1, imm); break
              case 0b100: i.LBU(rd, rs1, imm); break
              case 0b101: i.LHU(rd, rs1, imm); break
              default:
                throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
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
                throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
            }
          //FENCE.I it's a noop I guess?
          case 0b0001111: i.FENCEI(); break
          default:
            throw new Exception(f`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.S:
      //TODO: fill out
      break;
    case TYPES.B:
      //TODO: fill out
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
          case 0b1101111: //JAL
            i.JAL(rd, imm)
            break
          default:
            throw new Exception(f`Illegal opcode for instruction ${op.toString(16)}`)
        }
      }
      break;
    case TYPES.OTHER:
      //TODO: fill out
      break;
    default:
      throw new Exception(f`Illegal type for instruction ${op.toString(16)}`) 
  }
}

function gettype(opcode) {

  switch (opcode) {
    //R-type
    case 0b0110011:
    case 0b0010011:
    case 0b0001111:
    case 0b1110011:
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
