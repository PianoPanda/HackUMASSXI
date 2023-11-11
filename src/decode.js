
const TYPES = {
  R: 0,
  I: 1,
  S: 2,
  B: 3,
  U: 4,
  J: 5
}

function bitsfrom(what, start, bits) {
  
}


/* decode
 * takes operation: u32, a single assembly instruction
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
        switch (func) {
          case 0b001:
            //TODO:
            //SLLI, shamt, 
            break
          case 0b
          default: 
            throw new Exception(f`Illegal func for instruction ${op.toString(16)}`)
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
    default:
      throw new Exception(f`Illegal type for instruction ${op.toString(16)}`) 
  }
}

function gettype(opcode) {

  //TODO: fill out with opcodes
  switch (opcode) {

  }

  
}







