
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

  //TODO: fill out with opcodes
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







