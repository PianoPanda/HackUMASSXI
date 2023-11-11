

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


export const instructions = {
  ADDI: function(rd, rs1, imm) {
    setreg(rd, getreg(rs1) + imm)
  }
}



