export const RAM_SIZE = 1024*1024;
export const memory = new Uint8Array(RAM_SIZE)

/**
 * Performs an unaligned read from `memory`
 * @param {number} address
 * @returns {number} data at location `address`
 */
export function read32(address){
    const byte0 = memory[address + 0];
    const byte1 = memory[address + 1];
    const byte2 = memory[address + 2];
    const byte3 = memory[address + 3];

    return (
        byte0 << 0 |
        byte1 << 8 |
        byte2 << 16|
        byte3 << 24
    )
}

/**
 * Performs an unaligned write to `memory`
 * @param {number} address
 * @param {number} data
 * @returns {void} 
 */
export function write32(address, data){
    memory[address + 0] = data >> 0  & 0xff
    memory[address + 1] = data >> 8  & 0xff
    memory[address + 2] = data >> 16 & 0xff
    memory[address + 3] = data >> 24 & 0xff
}
