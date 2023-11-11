
const TYPES = {
  R: 0,
  I: 1,
  S: 2,
  B: 3,
  U: 4,
  J: 5,
  OTHER: 6
}

function bitsfrom(what, start, bits) {
  
}


/* decode
 * takes op: u32, a single assembly instruction
 * calls the instruction, returns void
 */
function decode(op) {

  const opcode = op & 0b1111111;

  const type = gettype(opcode)

  //TODO: fill out 
  switch (type) {

    case TYPES.R:
      //TODO: fill out
      const rd = bitsfrom(op, 7, 5);
      const funct3 = bitsfrom(op, 12, 3);
      const rs1 = bistfrom(op, 15, 5);
      const rs2 = bitsfrom(op, 20, 5)
      const funct7 = bitsfrom(op, 25, 7)
      
      switch (opcode) {
        case 0b0010011: 
        switch (funct3) {
          case 0b001: //SLLI, shamt, logical left shift
            //TODO:
            
            funct7 = 0b0000000
            break
          case 0b101: // SRLI, shamt, logical right shift 
            //TODO:
            
            funct7 = 0b0000000
          case 0b101: //SRAI, shamt, arithmetic right shift
            //TODO:
            funct7 = 0b0100000
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
      break;
    case TYPES.I:

      const rd = bitsfrom(op, 7, 5);
      const func = bitsform(op, 12, 3); 
      const rs1 = bitsfrom(op, 15, 5);
      const imm = bitsfrom(op, 20, 12);
      
      switch (opcode) {
        case 0b0010011:
          switch (func) {
            case 0b000:
              //TODO: implement add code
              break
            default:
              throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
          }
          
          break
          default:
            throw new Exception(f`Illegal opcode for instruction ${op.toString(16)}`)
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
      //TODO: fill out
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
    case 0b0110011: //ADD
    case 0b0110011: //SUB
    case 0b0110011: //SLL
    case 0b0110011: //SLT
    case 0b0110011: //SLTU
    case 0b0110011: //XOR
    case 0b0110011: //SRL
    case 0b0110011: //SRA
    case 0b0110011: //OR
    case 0b0110011: //AND
    case 0b0010011: //SLLI
    case 0b0010011: //SRLI
    case 0b0010011: //SRAI
    case 0b0001111: //FENCE
    case 0b1110011: //MUL
    case 0b1110011: //MULH
    case 0b1110011: //MULHSU
    case 0b1110011: //MULHU
    case 0b1110011: //DIV
    case 0b1110011: //DIVU
    case 0b1110011: //REM
    case 0b1110011: //REMU
    case 0b1110011: //LR.W
    case 0b1110011: //SC.W
    case 0b1110011: //AMOSWAP.W
    case 0b1110011: //AMOADD.W
    case 0b1110011: //AMOXOR.W
    case 0b1110011: //AMOAND.W
    case 0b1110011: //AMOOR.W
    case 0b1110011: //AMOMIN.W
    case 0b1110011: //AMOMAX.W
    case 0b1110011: //AMOMINU.W
    case 0b1110011: //AMOMAXU.W
      return TYPES.R;
    //I-type
    case 0b1100111: //JALR
    case 0b0000011: //LB
    case 0b0000011: //LH
    case 0b0000011: //LW
    case 0b0000011: //LBU
    case 0b0000011: //LHU
    case 0b0010011: //ADDI
    case 0b0010011: //SLTI
    case 0b0010011: //SLTIU
    case 0b0010011: //XORI
    case 0b0010011: //ORI
    case 0b0010011: //ANDI
    case 0b0001111: //FENCE.I
    case 0b1110011: //CSRRW
    case 0b1110011: //CSRRS
    case 0b1110011: //CSRRC
    case 0b1110011: //CSRRWI
    case 0b1110011: //CSRRSI
    case 0b1110011: //CSRRCI
      return TYPES.I;
    //S-type
    case 0b0100011: //SB
    case 0b0100011: //SH
    case 0b0100011: //SW
      return TYPES.S;
    //B-type
    case 0b1100011: //BEQ
    case 0b1100011: //BNE
    case 0b1100011: //BLT
    case 0b1100011: //BGE
    case 0b1100011: //BLTU
    case 0b1100011: //BGEU
      return TYPES.B
    //U-type
    case 0b0110111: //LUI
    case 0b0010111: //AUIPC
      return TYPES.U
    //J-type
    case 0b1101111: //JAL
      return TYPES.J
    //OTHER-type
    case 0b0001111: //FENCE.TSO
    case 0b0001111: //PAUSE
    case 0b1110011: //ECALL
    case 0b1110011: //EBREAK
      return TYPES.OTHER
  }

  
}







