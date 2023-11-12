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

const wantparams = (val) => (...a) => expect(a).toEqual(val)

test.skip("decode j suite", () => {
    // test JAL 0, _start
    decode.decode(0x6f000000, { JAL: wantparams([0, 0x0>>0]) });

});
test.skip("decode r suite", () => {
    decode.decode(0x33058500, { ADD: wantparams([10, 10, 8]) })
})

test.skip("decode i suite", () => {
    decode.decode(0x8320c100, { LW: wantparams([1, 2, 12]) })
})

test.skip("decode s suite", () => {
    decode.decode(0x23261100, { SW: wantparams([2, 1, 12]) })
})

test("decode b suite", () => {
    //TODO
})

test.skip("decode u suite", () => {
    decode.decode(0xb7170100, { LUI: wantparams([15, 69632]) })
})

