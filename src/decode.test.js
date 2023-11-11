import * as decode from "./decode.js";
import {test, expect} from "bun:test";

test("bitsfrom", () => {
    const testBit = 0b0011110;
    console.log((decode.bitsfrom(testBit, 1, 3) >>> 0).toString(2));
    expect(decode.bitsfrom(testBit, 1, 3))
        .toBe(0b111);
    expect(decode.bitsfrom(testBit, 2, 3))
    .toBe(0b111);
    expect(decode.bitsfrom(testBit, 0, 3))
    .toBe(0b110);
    expect(() => {decode.bitsfrom(testBit, 0, 0)})
    .toThrow();
});


test("combine", () => {
    expect(decode.combine([[0, 29], [7, 3]])).toBe(7);
    expect(decode.combine([[7, 3]])).toBe(7);
    expect(decode.combine([[3, 2], [6, 7], [3, 5], [9, 18]]))
        .toBe(-1022623735>>>0);
});

test("decode j suite", () => {
    const DEBUG_JAL = {
        JAL: (rd, imm) => {
            expect(rd).toBe(28);
            expect(imm>>>0).toBe(0xFFFEFF6C);
        }
    };
    // test JAL t3, 0
    decode.decode(0xF6DEFE6F, DEBUG_JAL);
});

const wantparams = (val) => (...a) => expect(a).toEqual(val)

test("decode r suite", () => {
    decode.decode(0x33058500, { ADD: wantparams([10, 10, 8]) })
})

test("decode i suite", () => {
    decode.decode(0x8320c100, { LW: wantparams([1, 2, 12]) })
})

test("decode s suite", () => {
    decode.decode(0x23261100, { SW: console.log})
})

