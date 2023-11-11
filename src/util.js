/**
 * Formats a number so that it fits within `[0x0, 0xFFFF_FFFF]`.
 * @param {number | bigint} value Must be an integer.
 * @returns {number}
 */
export function format32(value) {
    switch (typeof value) {
        case "number":
            if (!Number.isInteger(value)) throw new Error(`format32 called on non-integer value [${value}].`);
            if (!Number.isSafeInteger(value)) throw new Error(`format32 called on unsafe value [${value}].`);
            while (value < 0) {
                value += 0x1_0000_0000;
            }
            return Number(value % 0x1_0000_0000)
        case "bigint":
            while (value < 0n) {
                value += 0x1_0000_0000n;
            }
            return Number(value % 0x1_0000_0000n)
        default:
            throw new Error(`format32 called on non-number value ${value.toString()}`)
    }
}

/**
 * Converts an integer into a 32 bit binary string.
 * @param {number} value Must be an integer.
 * @returns {string} 
 */
export function toBinary(value) {
    return format32(value).toString(2).padStart(32, 0);
}

/**
 * Compares numbers as unsigned integers.
 * @param {number} a
 * @param {number} b
 */
export function compuns(a, b) {
    let [_a, __a, _b, __b] = [a >>> 1, a & 1, b >>> 1, b & 1]
    if (_a !== _b) return _a - _b
    else return __a == __b ? 0 : __a - __b
}
